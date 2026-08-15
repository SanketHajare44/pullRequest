const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            index: true,
            minLength: 4,
            maxLength: 50,
        },

        lastName: {
            type: String,
            trim: true,
        },

        emailId: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,

            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error(
                        "Email is invalid: " + value
                    );
                }
            },
        },

        // Password is already validated in
        // validateSignupData() before hashing.
        password: {
            type: String,
            required: true,
            trim: true,
        },

        age: {
            type: Number,
            min: 18,
        },

        gender: {
            type: String,

            validate(value) {
                if (
                    ![
                        "male",
                        "female",
                        "other",
                        "Male",
                        "Female",
                        "Other",
                    ].includes(value)
                ) {
                    throw new Error(
                        "Gender data is not valid"
                    );
                }
            },
        },

        photoUrl: {
            type: String,

            default:
                "https://upload.wikimedia.org/wikipedia/commons/d/dc/Profile_avatar_placeholder.png",

            validate(value) {
                if (!validator.isURL(value)) {
                    throw new Error(
                        "URL is invalid: " + value
                    );
                }
            },
        },

        about: {
            type: String,
            default:
                "This is the default about of the user!",
        },

        skills: {
            type: [String],
            lowercase: true,
        },
    },

    {
        timestamps: true,
    }
);


// =====================================
// CREATE JWT
// =====================================

userSchema.methods.getJWT = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d",
        }
    );
};


// =====================================
// VALIDATE PASSWORD
// =====================================

userSchema.methods.validatePassword =
    async function (passwordInputByUser) {

        return await bcrypt.compare(
            passwordInputByUser,
            this.password
        );
    };


// =====================================
// EXPORT MODEL
// =====================================

module.exports =
    mongoose.model(
        "User",
        userSchema
    );