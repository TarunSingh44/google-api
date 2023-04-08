const webhookRouter = require('express').Router();
const webhookController = require('../controllers/webhooks');

webhookRouter.use('/square', webhookController.square.ActivateProMembershipSubscription);

module.exports = webhookRouter;


const controller = require("../controllers/webhooks");
const express = require("express");
const router = express.Router();

/*
 * Webhook for when Square Subscriptions
 */
router.post("/subscriptions", controller.subscriptionWebhook);

module.exports = webhookRouter;