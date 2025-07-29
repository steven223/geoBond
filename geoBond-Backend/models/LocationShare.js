const mongoose = require('mongoose');

const locationShareSchema = new mongoose.Schema({
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: String,
  // ... other fields
});

module.exports = mongoose.model('LocationShare', locationShareSchema);
