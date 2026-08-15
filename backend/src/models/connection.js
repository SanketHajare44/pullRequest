const mongoose = require("mongoose");

const connectionRequestSchema =
    new mongoose.Schema(
        {
            fromUserId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },

            toUserId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },

            status: {
                type: String,
                required: true,
                enum: {
                    values: [
                        "accepted",
                        "rejected",
                        "ignored",
                        "interested",
                    ],
                    message:
                        "{VALUE} is incorrect status type",
                },
            },
        },
        {
            timestamps: true,
        }
    );


// =====================================
// INDEXES
// =====================================

connectionRequestSchema.index({
    fromUserId: 1,
    toUserId: 1,
});

connectionRequestSchema.index({
    toUserId: 1,
    status: 1,
});

connectionRequestSchema.index({
    fromUserId: 1,
    status: 1,
});


// =====================================
// PRE-SAVE VALIDATION
// =====================================

connectionRequestSchema.pre(
    "save",
    function () {
        const connectionRequest = this;

        if (
            connectionRequest.fromUserId.equals(
                connectionRequest.toUserId
            )
        ) {
            throw new Error(
                "You cannot send a request to yourself"
            );
        }
    }
);


const ConnectionRequestModel =
    mongoose.model(
        "connectionRequest",
        connectionRequestSchema
    );

module.exports =
    ConnectionRequestModel;