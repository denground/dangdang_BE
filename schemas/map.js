const mongoose = require('mongoose');

const mapsSchema = new mongoose.Schema(
    {
        path: {
            type: Array,
            required: true,
        },
        marker: {
            type: Array,
        },
        time: {
            type: String,
            required: true,
        },
        distance: {
            type: String,
            required: true,
        },
        userID: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Map', mapsSchema);
