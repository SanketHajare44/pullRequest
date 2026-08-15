const express = require("express");
const mongoose = require("mongoose");

const chatRouter = express.Router();

const Chat = require("../models/chat");
const User = require("../models/user");

const { userAuth } = require("../middlewares/userAuth");


// =====================================
// GET CHAT
// =====================================

chatRouter.get(
    "/chat/:targetUserId",
    userAuth,
    async (req, res) => {
        try {
            const { targetUserId } = req.params;
            const userId = req.user._id;

            // Validate target user ID
            if (
                !mongoose.Types.ObjectId.isValid(
                    targetUserId
                )
            ) {
                return res.status(400).json({
                    message:
                        "Invalid target user ID",
                });
            }

            // Check target user exists
            const targetUser =
                await User.findById(
                    targetUserId
                );

            if (!targetUser) {
                return res.status(404).json({
                    message:
                        "Target user not found",
                });
            }

            // Find existing chat
            let chat =
                await Chat.findOne({
                    participants: {
                        $all: [
                            userId,
                            targetUserId,
                        ],
                    },
                }).populate({
                    path: "messages.senderId",
                    select:
                        "firstName lastName photoUrl",
                });

            // Create chat if it doesn't exist
            if (!chat) {
                chat = new Chat({
                    participants: [
                        userId,
                        targetUserId,
                    ],
                    messages: [],
                });

                await chat.save();
            }

            res.status(200).json(chat);

        } catch (error) {
            console.error(
                "Error fetching chat:",
                error
            );

            res.status(500).json({
                message:
                    "Unable to fetch chat",
            });
        }
    }
);


module.exports = {
    chatRouter,
};