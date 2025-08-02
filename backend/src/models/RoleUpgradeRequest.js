const mongoose = require('mongoose');

const roleUpgradeRequestSchema = new mongoose.Schema({
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
});

module.exports = mongoose.model('RoleUpgradeRequest', roleUpgradeRequestSchema); 