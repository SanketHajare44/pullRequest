const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({
                message: "Please login",
            });
        }

        const decodedObj = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const { _id } = decodedObj;

        const user = await User.findById(_id);

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        req.user = user;

        next();

    } catch (error) {

        console.error(
            "Authentication error:",
            error
        );

        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};

module.exports = { userAuth };