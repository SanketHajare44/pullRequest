const validator = require("validator");
const bcrypt = require("bcrypt");


// =====================================
// SIGNUP VALIDATION
// =====================================

const validateSignupData = (req) => {

    const {
        firstName,
        lastName,
        emailId,
        password
    } = req.body;

    if (!firstName || !lastName) {
        throw new Error(
            "Name is not valid!"
        );
    }

    if (!emailId || !validator.isEmail(emailId)) {
        throw new Error(
            "Email is not valid!"
        );
    }

    if (
        !password ||
        !validator.isStrongPassword(password)
    ) {
        throw new Error(
            "Please enter a strong password"
        );
    }
};


// =====================================
// EDIT PROFILE VALIDATION
// =====================================

const validateEditProfileData = (req) => {

    const allowedEditFields = [
        "firstName",
        "lastName",
        "age",
        "gender",
        "photoUrl",
        "about",
        "skills"
    ];

    const isAllowedEditField =
        Object.keys(req.body).every(
            (field) =>
                allowedEditFields.includes(field)
        );

    return isAllowedEditField;
};


// =====================================
// EDIT PASSWORD VALIDATION
// =====================================

const validateEditPassword = async (req) => {

    const {
        existingPassword
    } = req.body;

    if (!existingPassword) {
        throw new Error(
            "Current password is required"
        );
    }

    const passwordHash =
        req.user.password;

    const isPasswordCorrect =
        await bcrypt.compare(
            existingPassword,
            passwordHash
        );

    return isPasswordCorrect;
};


module.exports = {
    validateSignupData,
    validateEditProfileData,
    validateEditPassword
};