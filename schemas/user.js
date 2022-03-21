const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
    {
        userID: {
            type: String,
            unique: true,
        },
        nickname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
        },
        provider: {
            type: String,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", usersSchema);
