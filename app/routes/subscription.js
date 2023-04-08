const subscriptionRouter = require('express').Router();
const subscriptionController = require('../controllers/subscription');
const { authenticationMiddleWare } = require('../middleware/auth');

subscriptionRouter.use(authenticationMiddleWare);

subscriptionRouter.get(
  '/plans',
  subscriptionController.plans.GetSubscriptionPlans
);

subscriptionRouter.get(
  '/plans/teams',
  subscriptionController.plans.GetTeamMembershipSubscriptionPlans
);

subscriptionRouter.post(
  '/plan',
   subscriptionController.plans.CreateDefaultSubscriptionPlan
)

subscriptionRouter.post(
  '/create',
  subscriptionController.createNewSubscription
);

module.exports = subscriptionRouter;
