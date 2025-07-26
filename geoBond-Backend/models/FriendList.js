const mongoose = require("mongoose");

const friendListSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  friendId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

friendListSchema.index({ userId: 1, friendId: 1 }, { unique: true });

module.exports = mongoose.model("FriendList", friendListSchema);
