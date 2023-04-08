const registerController = require("./register");
const loginController = require("./login");
const forgotPasswordController = require("./forgot-password");
const resetPasswordController = require("./reset-password");
const verifyEmailController = require("./verify-email");
const userController = require("./user");
const demoRequestController = require("./demo-request");
const templateController = require("./templates");

exports.register = registerController;
exports.login = loginController;
exports.setTemporaryPassword = forgotPasswordController.SetTemporaryPassword;
exports.resetPassword = resetPasswordController.ResetPassword;
exports.passwordResetLink = forgotPasswordController.SendPasswordResetLink;
exports.verifyEmail = verifyEmailController.VerifyEmail;
exports.resendVerificationToken =
	verifyEmailController.SendEmailVerificationToken;
exports.user = userController.GetCurrentlySignedInUser;
exports.sendDemoRequest = demoRequestController.sendDemoRequest;
exports.freeTemplates = templateController.getFreeTemplates;
exports.premiumTemplates = templateController.getPremiumTemplates;
