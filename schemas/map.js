const mongoose = require('mongoose');

const mapsSchema = new mongoose.Schema(
    {
        path: {
            type: Array,
            required: true,
        },
        water: {
            type: Number,
        },
        yellow: {
            type: Number,
        },
        brown: {
            type: Number,
        },
        danger: {
            type: Number,
        },
        time: {
            type: String,
            required: true,
        },
        distance: {
            type: String,
        },
        userID: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Map', mapsSchema);
