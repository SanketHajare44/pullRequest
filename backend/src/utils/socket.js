const { Server } = require("socket.io");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const Chat = require("../models/chat");
const User = require("../models/user");

const getSecretRoomId = (userId, targetUserId) => {
    return crypto
        .createHash("sha256")
        .update(
            [userId.toString(), targetUserId.toString()]
                .sort()
                .join("_")
        )
        .digest("hex");
};

const getTokenFromCookie = (cookieHeader) => {
    if (!cookieHeader) {
        return null;
    }

    const tokenMatch = cookieHeader.match(
        /(?:^|;\s*)token=([^;]+)/
    );

    if (!tokenMatch) {
        return null;
    }

    return decodeURIComponent(tokenMatch[1]);
};

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
        },
    });

    // Authenticate Socket.IO connection
    io.use(async (socket, next) => {
        try {
            const cookieHeader =
                socket.handshake.headers.cookie;

            const token =
                getTokenFromCookie(cookieHeader);

            if (!token) {
                return next(
                    new Error("Authentication required")
                );
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            const user = await User.findById(
                decoded._id
            );

            if (!user) {
                return next(
                    new Error("User not found")
                );
            }

            socket.user = user;

            next();

        } catch (error) {
            console.error(
                "Socket authentication error:",
                error.message
            );

            next(
                new Error(
                    "Socket authentication failed"
                )
            );
        }
    });

    io.on("connection", (socket) => {

        console.log(
            "Socket connected:",
            socket.id,
            "User:",
            socket.user._id.toString()
        );

        // =========================
        // JOIN CHAT
        // =========================

        socket.on(
            "joinChat",
            async ({ targetUserId }) => {
                try {
                    const userId =
                        socket.user._id;

                    const room =
                        getSecretRoomId(
                            userId,
                            targetUserId
                        );

                    console.log(
                        "Joining room:",
                        room
                    );

                    socket.join(room);

                } catch (error) {
                    console.error(
                        "Join chat error:",
                        error
                    );
                }
            }
        );

        // =========================
        // SEND MESSAGE
        // =========================

        socket.on(
            "sendMessage",
            async ({
                targetUserId,
                newMessage,
            }) => {
                try {
                    const userId =
                        socket.user._id;

                    if (
                        !newMessage ||
                        !newMessage.trim()
                    ) {
                        return;
                    }

                    const targetUser =
                        await User.findById(
                            targetUserId
                        );

                    if (!targetUser) {
                        return;
                    }

                    const roomId =
                        getSecretRoomId(
                            userId,
                            targetUserId
                        );

                    let chat =
                        await Chat.findOne({
                            participants: {
                                $all: [
                                    userId,
                                    targetUserId,
                                ],
                            },
                        });

                    if (!chat) {
                        chat = new Chat({
                            participants: [
                                userId,
                                targetUserId,
                            ],
                            messages: [],
                        });
                    }

                    chat.messages.push({
                        senderId: userId,
                        message:
                            newMessage.trim(),
                    });

                    await chat.save();

                    io.to(roomId).emit(
                        "messageReceived",
                        {
                            firstName:
                                socket.user.firstName,

                            lastName:
                                socket.user.lastName,

                            userId:
                                userId.toString(),

                            message:
                                newMessage.trim(),
                        }
                    );

                } catch (error) {
                    console.error(
                        "Error sending message:",
                        error
                    );
                }
            }
        );

        // =========================
        // DISCONNECT
        // =========================

        socket.on(
            "disconnect",
            () => {
                console.log(
                    "User disconnected:",
                    socket.id
                );
            }
        );
    });

    return io;
};

module.exports = initializeSocket;