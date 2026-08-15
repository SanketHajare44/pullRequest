const express = require("express");
const authRouter = express.Router();

const { validateSignupData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");


// =====================================
// SIGNUP
// =====================================

authRouter.post("/signup", async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            emailId,
            password,
            age,
            gender,
            photoUrl,
            about,
            skills,
        } = req.body;

        // Validate signup data
        validateSignupData(req);

        // Limit skills
        if (skills?.length > 10) {
            return res.status(400).json({
                message: "Skills cannot be more than 10",
            });
        }

        // Encrypt password
        const passwordHash = await bcrypt.hash(
            password,
            10
        );

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            age,
            gender,
            photoUrl,
            about,
            skills,
        });

        await user.save();

        res.status(201).json({
            message: "User added successfully",
        });

    } catch (error) {
        console.error("Signup error:", error);

        res.status(400).json({
            message:
                "Error saving the user: " +
                error.message,
        });
    }
});


// =====================================
// LOGIN
// =====================================

authRouter.post("/login", async (req, res) => {
    try {
        const {
            emailId,
            password,
        } = req.body;

        if (!emailId || !password) {
            return res.status(400).json({
                message:
                    "Email and password are required",
            });
        }

        const user = await User.findOne({
            emailId,
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const isPasswordValid =
            await user.validatePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const token = user.getJWT();

        const isProduction =
            process.env.NODE_ENV === "production";

        // JWT cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction
                ? "none"
                : "lax",
            maxAge:
                24 * 60 * 60 * 1000,
        });

        // Never send password hash
        const userResponse =
            user.toObject();

        delete userResponse.password;

        res.status(200).json(
            userResponse
        );

    } catch (error) {
        console.error(
            "Login error:",
            error
        );

        res.status(500).json({
            message: "Login failed",
        });
    }
});


// =====================================
// LOGOUT
// =====================================

authRouter.post("/logout", async (req, res) => {
    const isProduction =
        process.env.NODE_ENV === "production";

    res.clearCookie("token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction
            ? "none"
            : "lax",
    });

    res.status(200).json({
        message: "Logout successful",
    });
});


module.exports = {
    authRouter,
};