require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

const { connectDB } = require("./config/database");

const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/request");
const { userRouter } = require("./routes/user");
const { chatRouter } = require("./routes/chat");

const initializeSocket = require("./utils/socket");

const app = express();


// =====================================
// MIDDLEWARE
// =====================================

app.use(express.json());

app.use(cookieParser());

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);


// =====================================
// ROUTES
// =====================================

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);


// =====================================
// HTTP SERVER
// =====================================

const server = http.createServer(app);


// =====================================
// SOCKET.IO
// =====================================

initializeSocket(server);


// =====================================
// DATABASE + SERVER
// =====================================

connectDB()
    .then(() => {

        console.log(
            "Database connection established..."
        );

        server.listen(
            process.env.PORT,
            () => {

                console.log(
                    `Server is running on port ${process.env.PORT}`
                );

            }
        );

    })
    .catch((error) => {

        console.error(
            "Database connection failed:",
            error
        );

    });