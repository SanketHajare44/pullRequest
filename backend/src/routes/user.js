const express = require("express");
const { userAuth } = require("../middlewares/userAuth");

const userRouter = express.Router();

const ConnectionRequest =
    require("../models/connection");

const User = require("../models/user");

const SAFE_USER_DATA =
    "firstName lastName photoUrl age gender about skills";


// =====================================
// RECEIVED CONNECTION REQUESTS
// =====================================

userRouter.get(
    "/user/requests/received",
    userAuth,
    async (req, res) => {
        try {
            const { _id } = req.user;

            const connectionRequests =
                await ConnectionRequest.find({
                    toUserId: _id,
                    status: "interested",
                }).populate(
                    "fromUserId",
                    SAFE_USER_DATA
                );

            res.status(200).json({
                message:
                    "Received connection requests fetched successfully.",
                data: connectionRequests,
            });

        } catch (error) {
            console.error(
                "Error fetching requests:",
                error
            );

            res.status(500).json({
                message:
                    "Unable to fetch connection requests",
            });
        }
    }
);


// =====================================
// CONNECTIONS
// =====================================

userRouter.get(
    "/user/connections",
    userAuth,
    async (req, res) => {
        try {
            const { _id } = req.user;

            const connectionRequests =
                await ConnectionRequest.find({
                    $or: [
                        {
                            toUserId: _id,
                            status: "accepted",
                        },
                        {
                            fromUserId: _id,
                            status: "accepted",
                        },
                    ],
                })
                    .populate(
                        "fromUserId",
                        SAFE_USER_DATA
                    )
                    .populate(
                        "toUserId",
                        SAFE_USER_DATA
                    );

            const data =
                connectionRequests
                    .map((row) => {
                        if (
                            !row.fromUserId ||
                            !row.toUserId
                        ) {
                            return null;
                        }

                        if (
                            row.fromUserId._id.toString() ===
                            _id.toString()
                        ) {
                            return row.toUserId;
                        }

                        return row.fromUserId;
                    })
                    .filter(Boolean);

            res.status(200).json(data);

        } catch (error) {
            console.error(
                "Error fetching connections:",
                error
            );

            res.status(500).json({
                message:
                    "Unable to fetch connections",
            });
        }
    }
);


// =====================================
// USER FEED
// =====================================

userRouter.get(
    "/user/feed",
    userAuth,
    async (req, res) => {
        try {
            const { _id } = req.user;

            // =============================
            // PAGINATION
            // =============================

            const page = Math.max(
                parseInt(req.query.page) || 1,
                1
            );

            let limit =
                parseInt(req.query.limit) || 10;

            limit = Math.min(
                Math.max(limit, 1),
                50
            );

            const skip =
                (page - 1) * limit;


            // =============================
            // EXISTING REQUESTS
            // =============================

            const connectionRequests =
                await ConnectionRequest.find({
                    $or: [
                        {
                            fromUserId: _id,
                        },
                        {
                            toUserId: _id,
                        },
                    ],
                }).select(
                    "fromUserId toUserId"
                );


            // =============================
            // HIDE USERS
            // =============================

            const hideUsersFromFeed =
                new Set();

            connectionRequests.forEach(
                (request) => {
                    hideUsersFromFeed.add(
                        request.fromUserId.toString()
                    );

                    hideUsersFromFeed.add(
                        request.toUserId.toString()
                    );
                }
            );


            // =============================
            // FETCH FEED
            // =============================

            const users =
                await User.find({
                    _id: {
                        $nin:
                            Array.from(
                                hideUsersFromFeed
                            ),
                        $ne: _id,
                    },
                })
                    .select(SAFE_USER_DATA)
                    .skip(skip)
                    .limit(limit);


            res.status(200).json(users);

        } catch (error) {
            console.error(
                "Error fetching feed:",
                error
            );

            res.status(500).json({
                message:
                    "Unable to fetch feed",
            });
        }
    }
);


module.exports = {
    userRouter,
};