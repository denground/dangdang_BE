const mongoose = require("mongoose");

const profilesSchema = new mongoose.Schema(
    {
        petImage: {
            type: String,
        },
        petName: {
            type: String,
        },
        petGender: {
            type: String,
        },
        petBirth: {
            type: String,
        },
        petBreed: {
            type: String,
        },
        userID: {
            type: String,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Profile", profilesSchema);
