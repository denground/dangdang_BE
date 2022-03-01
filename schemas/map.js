const mongoose = require('mongoose');

const mapsSchema = new mongoose.Schema(
  {
    mapImage: {
      type: String,
      unique: true,
      required: true,
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
    discription: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Map', mapsSchema);
