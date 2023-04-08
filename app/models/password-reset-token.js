const mongoose = require('mongoose');

const PasswordResetTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    required: true,
  },
});

module.exports = mongoose.model('PasswordResetToken', PasswordResetTokenSchema);
