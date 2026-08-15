import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constant";
import axios from "axios";

const Chat = () => {
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    const { targetUserId } = useParams();

    const user = useSelector((store) => store.user);
    const userId = user?._id;

    const connections =
        useSelector((store) => store.connection) || [];

    const targetUser = connections.find(
        (connection) =>
            connection._id === targetUserId
    );

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    // =====================================
    // AUTO SCROLL TO LATEST MESSAGE
    // =====================================

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    // =====================================
    // FETCH OLD CHAT MESSAGES
    // =====================================

    const fetchChatMessages = async () => {
        try {
            const chat = await axios.get(
                BASE_URL + "/chat/" + targetUserId,
                {
                    withCredentials: true,
                }
            );

            const chatMessages =
                chat?.data?.messages?.map((msg) => {

                    const {
                        senderId,
                        message,
                    } = msg;

                    return {
                        firstName:
                            senderId?.firstName,

                        lastName:
                            senderId?.lastName,

                        userId:
                            senderId?._id,

                        message,
                    };
                }) || [];

            setMessages(chatMessages);

        } catch (error) {
            console.error(
                "Error fetching chat messages:",
                error
            );
        }
    };

    useEffect(() => {
        if (!targetUserId) {
            return;
        }

        fetchChatMessages();
    }, [targetUserId]);

    // =====================================
    // SOCKET CONNECTION
    // =====================================

    useEffect(() => {

        if (!userId || !targetUserId) {
            return;
        }

        const socket =
            createSocketConnection();

        socketRef.current = socket;

        // Join chat room
        socket.emit(
            "joinChat",
            {
                userId,
                targetUserId,
            }
        );

        // =================================
        // RECEIVE MESSAGE
        // =================================

        socket.on(
            "messageReceived",
            ({
                firstName,
                lastName,
                userId,
                message,
            }) => {

                console.log(
                    "MESSAGE RECEIVED:",
                    {
                        firstName,
                        lastName,
                        userId,
                        message,
                    }
                );

                setMessages(
                    (prevMessages) => [
                        ...prevMessages,
                        {
                            firstName,
                            lastName,
                            userId,
                            message,
                        },
                    ]
                );
            }
        );

        // Cleanup
        return () => {
            socket.disconnect();
            socketRef.current = null;
        };

    }, [userId, targetUserId]);

    // =====================================
    // SEND MESSAGE
    // =====================================

    const sendMessage = () => {

        if (!newMessage.trim()) {
            return;
        }

        socketRef.current?.emit(
            "sendMessage",
            {
                firstName:
                    user?.firstName,

                lastName:
                    user?.lastName,

                userId,

                targetUserId,

                newMessage:
                    newMessage.trim(),
            }
        );

        setNewMessage("");
    };

    // =====================================
    // ENTER KEY
    // =====================================

    const handleKeyDown = (e) => {

        if (e.key === "Enter") {

            e.preventDefault();

            sendMessage();
        }
    };

    // =====================================
    // UI
    // =====================================

    return (
        <div
            className="
                w-3/4
                mx-auto
                border
                border-gray-600
                m-5
                h-[70vh]
                flex
                flex-col
            "
        >

            {/* Header */}

            <h1 className="p-5 border border-gray-600">

                Chat with{" "}

                {targetUser
                    ? `${targetUser.firstName} ${targetUser.lastName}`
                    : "User"}

            </h1>

            {/* Messages */}

            <div
                className="
                    flex-1
                    p-5
                    overflow-y-auto
                "
            >

                {messages.map(
                    (msg, index) => {

                        const isMyMessage =
                            msg.userId === userId;

                        return (
                            <div
                                key={index}
                                className={`chat ${isMyMessage
                                    ? "chat-end"
                                    : "chat-start"
                                    }`}
                            >

                                {/* Avatar */}

                                <div className="chat-image avatar">

                                    <div className="w-10 rounded-full">

                                        <img
                                            alt="User"
                                            src={
                                                isMyMessage
                                                    ? user?.photoUrl
                                                    : targetUser?.photoUrl
                                            }
                                        />

                                    </div>

                                </div>

                                {/* Name */}

                                <div className="chat-header">

                                    {msg.firstName}{" "}
                                    {msg.lastName}

                                </div>

                                {/* Message */}

                                <div className="chat-bubble">

                                    {msg.message}

                                </div>

                            </div>
                        );
                    }
                )}

                {/* Scroll target */}

                <div ref={messagesEndRef} />

            </div>

            {/* Input */}

            <div
                className="
                    border
                    border-gray-600
                    p-5
                    flex
                    items-center
                    gap-2
                "
            >

                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) =>
                        setNewMessage(
                            e.target.value
                        )
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="
                        flex-1
                        border
                        border-gray-500
                        text-dark
                        p-2
                        rounded
                    "
                />

                <button
                    onClick={sendMessage}
                    className="btn btn-primary"
                >
                    Send
                </button>

            </div>

        </div>
    );
};

export default Chat;