const { sendApiErrorResponse, sendApiSuccessResponse } = require('../../../utils/response.utils');
const SubscriptionPlansModel = require('../../../models/subscription-plan');
const freeTrial = require('./free-trial');
const memberships = require('./memberships');
const { subscriptionPlansTypes } = require('../../../utils/subscriptions.utils');

async function GetSubscriptionPlans(req, res) {
  try {
    const subscriptionPlans = await SubscriptionPlansModel.find({
      type: subscriptionPlansTypes.MEMBERSHIP,
    });
    sendApiSuccessResponse(res, subscriptionPlans, 'Successfully fetched Subscriptions list');
  } catch (error) {
    sendApiErrorResponse(res, 'An error occurred while fetching subscription plans');
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

module.exports = {
  GetSubscriptionPlans,
  GetTeamMembershipSubscriptionPlans,
  freeTrial,
  memberships,
};
