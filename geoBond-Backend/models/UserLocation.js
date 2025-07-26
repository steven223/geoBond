const mongoose = require("mongoose");

const userLocationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lat: Number,
  lng: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("UserLocation", userLocationSchema);
