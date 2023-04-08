const { sendApiErrorResponse, sendApiSuccessResponse } = require('../../../utils/response.utils');
const SubscriptionPlanModel = require('../../../models/subscription-plan');
const SubscriptionPlansModel = require('../../../models/subscription-plan');
const { subscriptionPlansTypes } = require('../../../utils/subscriptions.utils');

async function GetSubscriptionPlans(req, res) {
  try {
    let subscriptionPlans = await SubscriptionPlanModel.find({
      $or: [
        { type: subscriptionPlansTypes.MEMBERSHIP },
        { type: subscriptionPlansTypes.ENTERPRISE },
      ],
    });
    const freeTrialIndex = subscriptionPlans.findIndex((plan) => plan.ref === 'FREE_TRIAL');

    subscriptionPlans = subscriptionPlans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      planType: plan.type,
      frequency: plan.frequency,
    }));

    if (freeTrialIndex) {
      subscriptionPlans.unshift(subscriptionPlans.splice(freeTrialIndex, 1)[0]);
    }
    sendApiSuccessResponse(
      res,
      subscriptionPlans,
      'Successfully fetched subscription plans',
    );
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}

async function GetTeamMembershipSubscriptionPlans(req, res) {
  try {
    const subscriptionPlans = await SubscriptionPlansModel.find({
      type: subscriptionPlansTypes.TEAM_MEMBERSHIP,
    });
    sendApiSuccessResponse(
      res,
      subscriptionPlans,
      'Successfully fetched Subscription plans',
    );
  } catch (error) {
    sendApiErrorResponse(res, 'An error occurred while fetching subscription plans');
  }
}

async function CreateDefaultSubscriptionPlan(req,res) {
  let keys = Object.keys(req.body);
  let key = keys[0];
  let sub = JSON.parse(key);
  sub.type = subscriptionPlansTypes.MEMBERSHIP;
  try {
    const subscription_plan = new SubscriptionPlansModel(sub)
    await subscription_plan.save(function(err,document,numRows){
      if (err) {
        console.log("error in save: ",err);
      }
    });
    sendApiSuccessResponse(
      res,
      subscription_plan,
      'Successfully created the Subscription plan',
    ) 
  } catch {
    sendApiErrorResponse(res, 'An error occurred while fetching subscription plans');
  }
}

module.exports = { GetSubscriptionPlans, GetTeamMembershipSubscriptionPlans, CreateDefaultSubscriptionPlan };
