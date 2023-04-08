const SubscriptionPlanModel = require('../../../../models/subscription-plan');
const { sendApiErrorResponse, sendApiSuccessResponse } = require('../../../../utils/response.utils');
const { subscriptionPlansTypes } = require('../../../../utils/subscriptions.utils');

const FREE_TRIAL_REF = 'FREE_TRIAL';

async function CreateFreeTrialSubscriptionPlan(req, res) {
  try {
    const existingSubscriptionPlan = await SubscriptionPlanModel.findOne({ ref: FREE_TRIAL_REF });
    if (existingSubscriptionPlan) {
      throw new Error('A free trial subscription plan has already been created');
    }
    const freeTrialSubscriptionPlan = await new SubscriptionPlanModel({
      ref: FREE_TRIAL_REF,
      name: req.body.name || 'Free Trial',
      price: 0,
      type: subscriptionPlansTypes.MEMBERSHIP,
      duration: Number.parseInt(req.body.duration?.toString(), 10) || 7,
    }).save();
    sendApiSuccessResponse(
      res,
      freeTrialSubscriptionPlan,
      'The free trial subscription plan has been created successfully',
    );
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}

async function UpdateFreeTrialSubscriptionPlan(req, res) {
  try {
    const subscriptionPlan = await SubscriptionPlanModel.findOneAndUpdate({ ref: FREE_TRIAL_REF }, {
      name: req.body.name,
      duration: req.body.duration,
    }, { new: true });

    if (!subscriptionPlan) {
      throw new Error('A free trial subscription has not been created.');
    }

    sendApiSuccessResponse(res, subscriptionPlan, 'The free trial subscription plan has been updated successfully');
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}

async function DeleteFreeTrialSubscriptionPlan(req, res) {
  try {
    if (!req.body.id || req.body.id !== FREE_TRIAL_REF) {
      throw new Error('Invalid attempt to delete free trial subscription plan');
    }
    await SubscriptionPlanModel.deleteOne({ ref: FREE_TRIAL_REF });
    sendApiSuccessResponse(res, null, 'The free trial subscription plan has been deleted');
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}

module.exports = {
  CreateFreeTrialSubscriptionPlan,
  UpdateFreeTrialSubscriptionPlan,
  DeleteFreeTrialSubscriptionPlan,
};
