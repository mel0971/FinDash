const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  holdingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Holding',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String
  },
  alertType: {
    type: String,
    enum: ['PRICE_UP', 'PRICE_DOWN', 'PERCENT_CHANGE'],
    required: true
  },
  targetPrice: {
    type: Number
  },
  percentChange: {
    type: Number
  },
  referencePrice: {
    type: Number
  },
  isActive: {
    type: Boolean,
    default: true
  },
  triggered: {
    type: Boolean,
    default: false
  },
  triggeredAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Alert', alertSchema);
