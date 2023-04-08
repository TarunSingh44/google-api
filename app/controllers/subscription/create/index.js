const { v4: uuid } = require('uuid');
const { sendApiSuccessResponse, sendApiErrorResponse } = require('../../../utils/response.utils');
const SubscriptionModel = require('../../../models/subscription');
const squareClient = require('../../../utils/square.utils');
const environment = require('../../../../config/environment');
const SubscriptionPlanModel = require('../../../models/subscription-plan');
const { convertHoursToMilliseconds } = require('../../../utils/api.utils');

async function CreateFreeTrialForUser(user, existingSubscription, subscriptionPlan) {
  if (existingSubscription
    && (existingSubscription.isActive || existingSubscription.payments.length > 0)
  ) {
    throw new Error('Sorry, You are no longer eligible for a free trial');
  }
  const date = new Date();
  const subscription = new SubscriptionModel({
    userId: user.id,
    isActive: true,
    payments: [{
      subscriptionPlanId: subscriptionPlan.id,
      squareSubscriptionId: null,
      squareInvoiceId: null,
      subscriptionPlanRef: 'FREE_TRIAL',
      createdAt: date.getTime(),
      expiresAt: new Date(
        date.getTime()
        + convertHoursToMilliseconds(subscriptionPlan.duration * 24),
      ),
    }],
  });
  await subscription.save();
  await user.updateOne({ subscriptionId: subscription.id });
  return {
    data: subscription,
    message: 'Your free trial has been successfully activated.',
  };
}

async function CreateProMembershipSubscriptionForUser(
  user,
  existingSubscription,
  subscriptionPlan,
  requestBody,
) {
  if (!requestBody.cardToken) {
    throw new Error('Missing value of card token in request body');
  }

  const userWithCustomerId = user;
  if (existingSubscription
    && (existingSubscription.payments.length > 0 && existingSubscription.payments[existingSubscription.payments.length - 1].subscriptionPlanRef !== 'FREE_TRIAL')
  ) {
    // TODO:  Check if plan is active before throwing an error
    throw new Error('You already have an active subscription.');
  }

  if (!user.customerId) {
    const customer = await squareClient.customersApi.createCustomer({
      familyName: user.lastName,
      givenName: user.firstName,
      emailAddress: user.email,
      referenceId: user.id,
      idempotencyKey: uuid().toString(),
    });
    await user.update(
      { customerId: customer.result.customer.id },
      { new: true },
    );
    userWithCustomerId.customerId = customer.result.customer.id;
  }

  const { result: { card } } = await squareClient.cardsApi.createCard({
    card: {
      customerId: userWithCustomerId.customerId,
    },
    sourceId: requestBody.cardToken,
    idempotencyKey: uuid().toString(),
  });

  const { result: { subscription } } = await squareClient.subscriptionsApi.createSubscription({
    customerId: userWithCustomerId.customerId,
    locationId: environment.SQUARE_LOCATION_ID,
    planId: subscriptionPlan.ref,
    cardId: card.id,
    idempotencyKey: uuid().toString(),
  });

  if (!existingSubscription) {
    const userSubscription = await new SubscriptionModel({
      userId: user.id,
      isActive: false,
      squareCardId: card.id,
      squareSubscriptionId: subscription.id,
    }).save();
    await user.updateOne({ subscriptionId: userSubscription.id });
  } else {
    await existingSubscription.update({
      squareCardId: card.id,
      squareSubscriptionId: subscription.id,
    }, { new: true });
  }

  return {
    data: existingSubscription,
    message: `Successfully created your ${subscriptionPlan.name} subscription`,
  };
}

async function CreateNewSubscriptionForUser(req, res) {
  try {
    const { user, body } = req;
    const subscriptionPlan = await SubscriptionPlanModel.findById(body.subscriptionId);
    if (!subscriptionPlan) throw new Error('This subscription plan does not exist.');
    let result = {};

    const existingSubscription = await SubscriptionModel.findByUserId(user.id);
    if (subscriptionPlan.ref === 'FREE_TRIAL') {
      result = await CreateFreeTrialForUser(user, existingSubscription, subscriptionPlan);
    }

    if (subscriptionPlan.ref !== 'FREE_TRIAL') {
      result = await CreateProMembershipSubscriptionForUser(
        user,
        existingSubscription,
        subscriptionPlan,
        req.body,
      );
    }

    sendApiSuccessResponse(
      res,
      result.data,
      result.message,
    );
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}

module.exports = CreateNewSubscriptionForUser;
