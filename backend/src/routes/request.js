const express = require("express");
const mongoose = require("mongoose");

const { userAuth } = require("../middlewares/userAuth");

const ConnectionRequest =
    require("../models/connection");

const User = require("../models/user");

const requestRouter = express.Router();


// =====================================
// SEND CONNECTION REQUEST
// =====================================

requestRouter.post(
    "/request/send/:status/:toUserId",
    userAuth,
    async (req, res) => {
        try {
            const fromUserId = req.user._id;
            const { status, toUserId } = req.params;

            // Validate status
            const allowedStatus = [
                "ignored",
                "interested",
            ];

            if (!allowedStatus.includes(status)) {
                return res.status(400).json({
                    message:
                        "Invalid status type: " +
                        status,
                });
            }

            // Validate user ID
            if (
                !mongoose.Types.ObjectId.isValid(
                    toUserId
                )
            ) {
                return res.status(400).json({
                    message: "Invalid user ID",
                });
            }

            // Prevent sending request to yourself
            if (
                fromUserId.toString() ===
                toUserId.toString()
            ) {
                return res.status(400).json({
                    message:
                        "You cannot send a connection request to yourself",
                });
            }

            // Check target user
            const toUser =
                await User.findById(toUserId);

            if (!toUser) {
                return res.status(404).json({
                    message: "User not found",
                });
            }

            // Check existing request
            const existingConnectionRequest =
                await ConnectionRequest.findOne({
                    $or: [
                        {
                            fromUserId,
                            toUserId,
                        },
                        {
                            fromUserId: toUserId,
                            toUserId: fromUserId,
                        },
                    ],
                });

            if (existingConnectionRequest) {
                return res.status(409).json({
                    message:
                        "Connection request already exists",
                });
            }

            // Create request
            const connectionRequest =
                new ConnectionRequest({
                    fromUserId,
                    toUserId,
                    status,
                });

            const data =
                await connectionRequest.save();

            res.status(201).json({
                message:
                    `${req.user.firstName} is ${status} in ${toUser.firstName}`,
                data,
            });

        } catch (error) {
            console.error(
                "Send connection request error:",
                error
            );

            res.status(500).json({
                message:
                    "Unable to send connection request",
            });
        }
    }
);


// =====================================
// REVIEW CONNECTION REQUEST
// =====================================

requestRouter.post(
    "/request/review/:status/:requestId",
    userAuth,
    async (req, res) => {
        try {
            const {
                status,
                requestId,
            } = req.params;

            const allowedStatus = [
                "accepted",
                "rejected",
            ];

            // Validate status
            if (!allowedStatus.includes(status)) {
                return res.status(400).json({
                    message:
                        "Invalid review status",
                });
            }

            // Validate request ID
            if (
                !mongoose.Types.ObjectId.isValid(
                    requestId
                )
            ) {
                return res.status(400).json({
                    message:
                        "Invalid request ID",
                });
            }

            const loggedInUser =
                req.user;

            // Find only requests sent
            // to the logged-in user
            const connectionRequest =
                await ConnectionRequest.findOne({
                    _id: requestId,
                    toUserId:
                        loggedInUser._id,
                    status: "interested",
                });

            if (!connectionRequest) {
                return res.status(404).json({
                    message:
                        "Connection request not found",
                });
            }

            // Update status
            connectionRequest.status =
                status;

            await connectionRequest.save();

            res.status(200).json({
                message:
                    `Request is ${status}`,
            });

        } catch (error) {
            console.error(
                "Review connection request error:",
                error
            );

            res.status(500).json({
                message:
                    "Unable to review connection request",
            });
        }
    }
);


module.exports = {
    requestRouter,
};