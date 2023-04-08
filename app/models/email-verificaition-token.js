const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

const EmailVerificationTokenSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'User',
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

EmailVerificationTokenSchema.statics.Upsert = function (user) {
  if (user.isEmailVerified) {
    throw new Error('Your email address has already been verified');
  }
  return this.findOneAndUpdate(
    { userId: user.id },
    { userId: user.id, code: uuid().toString(), createdAt: Date.now() },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
};

module.exports = mongoose.model('EmailVerificationToken', EmailVerificationTokenSchema);
