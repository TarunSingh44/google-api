// const crypto = require('crypto');
// const environment = require('../../../../config/environment');

const SubscriptionModel = require('../../../models/subscription');
const SubscriptionPlanModel = require('../../../models/subscription-plan');
const UserModel = require('../../../models/user');
const squareClient = require('../../../utils/square.utils');

// function isFromSquare(signature, body) {
//   const hmac = crypto.createHmac('sha256', environment.SQUARE_SIGNATURE);
//   console.log(hmac);
//   hmac.update(environment.SQUARE_WEBHOOK_URL + JSON.stringify(body));
//   const hash = hmac.digest('base64');
//   console.log(hash, signature);
//   return hash === signature;
// }

async function handleInvoicePaymentMadeWebhook(payload) {
  const existingInvoiceRecord = await SubscriptionModel.findOne({
    'payments.squareInvoiceId': payload.data.id,
  });

  if (existingInvoiceRecord) {
    throw new Error(`Payment associated with this invoice has been completed: ${JSON.stringify(payload)}`);
  }

  if (payload.data.object.invoice.status.toLowerCase() !== 'paid') {
    throw new Error(`Payment status is not paid: ${JSON.stringify(payload)}`);
  }

  const {
    result: { subscription: squareSubscription },
  } = await squareClient.subscriptionsApi.retrieveSubscription(
    payload.data.object.invoice.subscription_id,
  );

  const user = await UserModel.findOne({
    $or: [
      { customerId: payload.data.object.invoice.primary_recipient.customer_id },
      { email: payload.data.object.invoice.primary_recipient.email_address },
    ],
  });

  if (!user) return;

  const subscriptionPlan = await SubscriptionPlanModel.findOne({
    ref: squareSubscription.planId,
  });

  const subscriptionExpirationDate = new Date(squareSubscription.chargedThroughDate);
  subscriptionExpirationDate.setDate(subscriptionExpirationDate.getDate() + 1);

  await SubscriptionModel.findOneAndUpdate({ userId: user.id }, {
    $set: {
      isActive: true,
    },
    $push: {
      payments: {
        subscriptionPlanId: subscriptionPlan.id,
        subscriptionPlanRef: subscriptionPlan.ref,
        squareSubscriptionId: payload.data.object.invoice.subscription_id,
        squareInvoiceId: payload.data.id,
        expiresAt: subscriptionExpirationDate,
        createdAt: new Date(squareSubscription.startDate),
      },
    },
  }, { new: true });
}

async function ActivateProMembershipSubscription(req, res) {
  // if (environment.NODE_ENV === 'production') {
  //   const signature = req.headers['x-square-hmacsha256-signature'];
  //   console.log(signature);
  //   console.log(environment.SQUARE_SIGNATURE);
  //   if (isFromSquare(signature, req.body)) {
  //     res.sendStatus(200);
  //   } else {
  //     return res.sendStatus(403);
  //   }
  // } else {
  // }
  res.sendStatus(200);

  try {
    switch (req.body.type) {
      case 'invoice.payment_made':
        await handleInvoicePaymentMadeWebhook(req.body);
        break;
      default:
        throw new Error(`Unsupported event emitted: ${req.body.type}`);
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = { ActivateProMembershipSubscription };
