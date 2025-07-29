const mongoose = require('mongoose');

const userLocationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  address: {
    type: String,
    default: ''
  },
  allUserAddress: [
    {
      type: JSON,
      default: {}
    }
  ]
}, {
  timestamps: true
});

// Index for efficient queries
userLocationSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('UserLocation', userLocationSchema);
