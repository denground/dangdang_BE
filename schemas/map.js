const mongoose = require('mongoose');

const mapsSchema = new mongoose.Schema(
    {
        path: {
            type: Array,
            required: true,
        },
        water: {
            type: Array,
        },
        yellow: {
            type: Array,
        },
        brown: {
            type: Array,
        },
        danger: {
            type: Array,
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
