const mongoose = require('mongoose');

const ticketCommentSchema = new mongoose.Schema({
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  isInternal: { type: Boolean, default: false }, // Internal notes visible only to agents/admins
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('TicketComment', ticketCommentSchema);
