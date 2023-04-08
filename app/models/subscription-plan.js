const mongoose = require('mongoose');
const { subscriptionPlansTypes, subscriptionFrequencies } = require('../utils/subscriptions.utils');

const SubscriptionPlanSchema = new mongoose.Schema({
  ref: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: Object.keys(subscriptionPlansTypes),
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
  },
  frequency: {
    type: String,
    enum: Object.keys(subscriptionFrequencies),
  },
});

module.exports = mongoose.model('Subscription Plan', SubscriptionPlanSchema);
