const adminRouter = require("express").Router();
const adminController = require("../controllers/admin");
const { authenticationMiddleWare } = require("../middleware/auth");
const { sendApiErrorResponse } = require("../utils/response.utils");

adminRouter.use(authenticationMiddleWare, (req, res, next) => {
	if (req.user.role !== "admin") {
		sendApiErrorResponse(
			res,
			"Access to this resource has been denied. Please contact an administrator to gain access"
		);
		return;
	}
	next();
});

adminRouter.get(
	"/subscription-plans",
	adminController.subscriptionPlans.GetSubscriptionPlans
);

adminRouter.post(
	"/subscription-plans/free-trial",
	adminController.subscriptionPlans.freeTrial.CreateFreeTrialSubscriptionPlan
);

adminRouter.patch(
	"/subscription-plans/free-trial",
	adminController.subscriptionPlans.freeTrial.UpdateFreeTrialSubscriptionPlan
);

adminRouter.delete(
	"/subscription-plans/free-trial",
	adminController.subscriptionPlans.freeTrial.DeleteFreeTrialSubscriptionPlan
);

adminRouter.post(
	"/subscription-plans/memberships",
	adminController.subscriptionPlans.memberships.CreateSubscriptionPlan.validate,
	adminController.subscriptionPlans.memberships.CreateSubscriptionPlan
);

adminRouter.patch(
	"/subscription-plans/memberships/:id",
	adminController.subscriptionPlans.memberships.UpdateSubscriptionPlan.validate,
	adminController.subscriptionPlans.memberships.UpdateSubscriptionPlan
);

adminRouter.delete(
	"/subscription-plans/memberships/:id",
	adminController.subscriptionPlans.memberships.DeleteSubscriptionPlan
);

adminRouter.post(
	"/webhook/square",
	adminController.webhook.RegisterSubscriptionWebhook
);

//*
//* TEMPLATES
//*
adminRouter.get("/templates", adminController.templates.getAllTemplates);
adminRouter.post(
	"/templates",
	adminController.templates.createNewTemplate.validate,
	adminController.templates.createNewTemplate
);
adminRouter.post(
	"/templates/:id",
	adminController.templates.updateSingleTemplate.validate,
	adminController.templates.updateSingleTemplate
);

module.exports = adminRouter;
