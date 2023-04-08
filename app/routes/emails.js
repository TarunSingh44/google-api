const controller = require("../controllers/emails");
const express = require("express");
const router = express.Router();

/*
 * Sends an email with login credentials to a user newly registered under a company
 */
router.post("/add-user", controller.addUser);

/*
 * Sends an email with a temporary password
 */
router.post("/forgot-password", controller.forgotPassword);

/*
 * Sends an email to our team when a potential user requests a demo
 */
router.post("/demo-request", controller.demoRequest);

module.exports = router;
