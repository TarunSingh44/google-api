const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
  },
  squareCardId: {
    type: String,
    default: null,
  },
  squareSubscriptionId: {
    type: String,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  payments: {
    type: [{
      subscriptionPlanId: String,
      squareSubscriptionId: String,
      subscriptionPlanRef: String,
      squareInvoiceId: String,
      createdAt: mongoose.Schema.Types.Date,
      expiresAt: mongoose.Schema.Types.Date,
    }],
    default: [],
  },
});

SubscriptionSchema.statics.findByUserId = function (userId) {
  return this.findOne({ userId });
};

SubscriptionSchema.methods.hasExpired = function () {
  return new Date(this.payments[this.payments.length - 1].expiresAt).getTime() < Date.now();
};

module.exports = mongoose.model('Subscription', SubscriptionSchema);
