const SubscriptionModel = require('../../models/subscription');
const { sendApiErrorResponse, sendApiSuccessResponse } = require('../../utils/response.utils');

async function getUserSubscription(req, res) {
  try {
    let subscription = await SubscriptionModel.findByUserId(req.user.id);
    if (subscription) {
      subscription = subscription.toJSON();
      subscription.isActive = new Date(
        subscription.payments[subscription.payments.length - 1].expiresAt,
      ).getTime() > Date.now();
    }
    sendApiSuccessResponse(res, subscription, 'Successfully fetched subscription data');
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}

exports.getUserSubscription = getUserSubscription;
exports.createNewSubscription = require('./create');
exports.plans = require('./plans');
