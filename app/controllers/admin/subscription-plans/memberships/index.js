const { v4: uuid } = require('uuid');
const { ApiError } = require('square');
const squareClient = require('../../../../utils/square.utils');
const { sendApiSuccessResponse, sendApiErrorResponse } = require('../../../../utils/response.utils');
const SubscriptionPlanModel = require('../../../../models/subscription-plan');
const { validateCreateSubscriptionPlanRequestBody } = require('./validator');

async function CreateSubscriptionPlan(req, res) {
  try {
    const { result: squareSubscriptionPlan } = await squareClient.catalogApi.upsertCatalogObject({
      idempotencyKey: uuid().toString(),
      object: {
        type: 'SUBSCRIPTION_PLAN',
        id: '#ProMembership',
        subscriptionPlanData: {
          name: req.body.name,
          phases: [{
            cadence: req.body.frequency,
            recurringPriceMoney: {
              amount: parseFloat(req.body.price) * 100, // amount converted to cents
              currency: 'USD',
            },
          }],
        },
      },
    });
    const subscriptionPlan = await new SubscriptionPlanModel({
      ref: squareSubscriptionPlan.catalogObject.id,
      name: req.body.name,
      type: req.body.type,
      price: parseFloat(req.body.price),
      frequency: req.body.frequency,
    }).save();
    sendApiSuccessResponse(res, subscriptionPlan, 'You have successfully created a Pro Membership plan.');
  } catch (error) {
    if (error instanceof ApiError) {
      console.log(error);
      sendApiErrorResponse(res, 'An error occurred while creating this subscription plan. Please try again');
      return;
    }
    sendApiErrorResponse(res, error);
  }
}
CreateSubscriptionPlan.validate = validateCreateSubscriptionPlanRequestBody;
/*
* When we update the base subscription, we want every user's next billing
* to be same. So, we choose update the current active plan, over
* creating a new one
* */
async function UpdateSubscriptionPlan(req, res) {
  try {
    // const subscriptionPlan = await SubscriptionPlanModel.findById(req.params.id);
    // const { result: { object: existingSquareSubscriptionPlan } } = await squareClient
    //   .catalogApi.retrieveCatalogObject(subscriptionPlan.ref);
    // console.log(existingSquareSubscriptionPlan.subscriptionPlanData.phases);
    // // https://developer.squareup.com/docs/catalog-api/update-catalog-objects
    // const squareSubscriptionPlan = await squareClient.catalogApi.upsertCatalogObject({
    //   idempotencyKey: uuid().toString(),
    //   object: {
    //     id: existingSquareSubscriptionPlan.id,
    //     version: existingSquareSubscriptionPlan.version,
    //     type: existingSquareSubscriptionPlan.type,
    //     subscriptionPlanData: {
    //       name: req.body.name,
    //       phases: existingSquareSubscriptionPlan.subscriptionPlanData.phases,
    //     },
    //   },
    // });
    // console.log(squareSubscriptionPlan);
    // await subscriptionPlan.update({
    //   name: req.body.name,
    //   price: req.body.price,
    //   frequency: req.body.frequency,
    // });

    const subscriptionPlan = await SubscriptionPlanModel.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      price: req.body.price,
    }, { new: true });

    sendApiSuccessResponse(
      res,
      subscriptionPlan,
      'The subscription plans has been successfully updated',
    );
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}
UpdateSubscriptionPlan.validate = validateCreateSubscriptionPlanRequestBody;

async function DeleteSubscriptionPlan(req, res) {
  try {
    const subscriptionPlan = await SubscriptionPlanModel.findById(req.params.id);
    if (!subscriptionPlan) throw new Error('This subscription plan does not exist');

    const { result: { object: existingSquareSubscriptionPlan } } = await squareClient
      .catalogApi.retrieveCatalogObject(subscriptionPlan.ref);
    // https://developer.squareup.com/docs/catalog-api/update-catalog-objects
    await squareClient.catalogApi.upsertCatalogObject({
      idempotencyKey: uuid().toString(),
      object: {
        ...existingSquareSubscriptionPlan,
        presentAtAllLocations: false,
      },
    });

    await subscriptionPlan.deleteOne();
    sendApiSuccessResponse(
      res,
      null,
      'The subscription plan has been successfully deleted',
    );
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}

module.exports = { CreateSubscriptionPlan, UpdateSubscriptionPlan, DeleteSubscriptionPlan };
