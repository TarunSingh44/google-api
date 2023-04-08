const mixpanelRouter = require("express").Router();
const mixpanelController = require("../controllers/mixpanel");

mixpanelRouter.post("/", mixpanelController.sendMixPanelEvent);

module.exports = mixpanelRouter;
