const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
});

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  answers: [answerSchema],
  createdAt: { type: Date, default: Date.now },
});

questionSchema.index({ title: 'text', description: 'text', tags: 'text' }); // For search

module.exports = mongoose.model('Question', questionSchema); 