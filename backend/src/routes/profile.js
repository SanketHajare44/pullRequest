const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/userAuth");

const {
    validateEditProfileData,
    validateEditPassword,
} = require("../utils/validation");

const validator = require("validator");
const bcrypt = require("bcrypt");


// =====================================
// VIEW PROFILE
// =====================================

profileRouter.get(
    "/profile/view",
    userAuth,
    async (req, res) => {
        try {
            const user = req.user.toObject();

            // Never send password to frontend
            delete user.password;

            res.status(200).json(user);

        } catch (error) {
            console.error(
                "Profile view error:",
                error
            );

            res.status(500).json({
                message:
                    "Unable to fetch profile",
            });
        }
    }
);


// =====================================
// EDIT PROFILE
// =====================================

profileRouter.patch(
    "/profile/edit",
    userAuth,
    async (req, res) => {
        try {
            if (!validateEditProfileData(req)) {
                return res.status(400).json({
                    message:
                        "Invalid edit request",
                });
            }

            const loggedInUser = req.user;

            Object.keys(req.body).forEach(
                (key) => {
                    loggedInUser[key] =
                        req.body[key];
                }
            );

            await loggedInUser.save();

            const updatedUser =
                loggedInUser.toObject();

            // Never send password to frontend
            delete updatedUser.password;

            res.status(200).json({
                message:
                    `${loggedInUser.firstName}, your profile updated successfully`,
                data: updatedUser,
            });

        } catch (error) {
            console.error(
                "Profile update error:",
                error
            );

            res.status(400).json({
                message: error.message,
            });
        }
    }
);


// =====================================
// CHANGE PASSWORD
// =====================================

profileRouter.patch(
    "/profile/password",
    userAuth,
    async (req, res) => {
        try {
            const {
                newPassword,
            } = req.body;

            const isPasswordCorrect =
                await validateEditPassword(req);

            if (!isPasswordCorrect) {
                return res.status(400).json({
                    message:
                        "Invalid existing password",
                });
            }

            if (
                !newPassword ||
                !validator.isStrongPassword(
                    newPassword
                )
            ) {
                return res.status(400).json({
                    message:
                        "New password is not strong enough",
                });
            }

            const passwordHash =
                await bcrypt.hash(
                    newPassword,
                    10
                );

            req.user.password =
                passwordHash;

            await req.user.save();

            res.status(200).json({
                message:
                    "Password updated successfully",
            });

        } catch (error) {
            console.error(
                "Password update error:",
                error
            );

            res.status(400).json({
                message: error.message,
            });
        }
    }
);


module.exports = {
    profileRouter,
};