const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  passwordHash: String,
  phone: String,
  profileImageUrl: String,
  bio: String,
  dob: Date,
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
  location: {
    city: String,
    state: String,
    country: String,
  },
  lastKnownLocation: {
    lat: Number,
    lng: Number,
    timestamp: Date
  },
  isPaidUser: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
