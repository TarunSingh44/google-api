const { v4: uuid } = require('uuid');
const squareClient = require('../../../utils/square.utils');
const { sendApiSuccessResponse, sendApiErrorResponse } = require('../../../utils/response.utils');

async function RegisterSubscriptionWebhook(req, res) {
  try {
    const webhook = await squareClient.webhookSubscriptionsApi.createWebhookSubscription({
      idempotencyKey: uuid().toString(),
      subscription: {
        name: 'Pro Membership Subscription Webhook',
        eventTypes: ['order.updated', 'payment.updated'],
        notificationUrl: req.body.url,
      },
    });
    sendApiSuccessResponse(res, webhook, 'Webhook url registered successfully');
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}

module.exports = { RegisterSubscriptionWebhook };
