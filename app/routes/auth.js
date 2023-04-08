const trimRequest = require("trim-request");
const authRouter = require("express").Router();
const authController = require("../controllers/auth");
const { authenticationMiddleWare } = require("../middleware/auth");

authRouter.get("/user", authenticationMiddleWare, authController.user);

authRouter.post(
	"/register",
	trimRequest.all,
	authController.register.validate,
	authController.register
);

authRouter.post(
	"/login",
	trimRequest.all,
	authController.login.validate,
	authController.login
);

authRouter.get(
	"/verify-email",
	trimRequest.all,
	authController.verifyEmail.validate,
	authController.verifyEmail
);

authRouter.post(
	"/resend-verification-token",
	trimRequest.all,
	authenticationMiddleWare,
	authController.resendVerificationToken
);

authRouter.post(
	"/forgot-password/verification",
	trimRequest.all,
	authController.passwordResetLink.validate,
	authController.passwordResetLink
);

// authRouter.post(
// 	"/forgot-password/reset-password",
// 	trimRequest.all,
// 	authController.resetPassword.validate,
// 	authController.resetPassword
// );

authRouter.post(
	"/forgot-password/email",
	trimRequest.all,
	authController.setTemporaryPassword.validate,
	authController.setTemporaryPassword
);

authRouter.patch(
	"/reset-password",
	trimRequest.all,
	authenticationMiddleWare,
	authController.resetPassword.validate,
	authController.resetPassword
);

authRouter.post(
	"/demo-request",
	trimRequest.all,
	authController.sendDemoRequest.validate,
	authController.sendDemoRequest
);
authRouter.get(
	"/free-templates",
	trimRequest.all,
	authenticationMiddleWare,
	authController.freeTemplates
);
authRouter.get(
	"/premium-templates",
	trimRequest.all,
	authenticationMiddleWare,
	authController.premiumTemplates
);

module.exports = authRouter;

/*
 * Register company user route
 */
// router.post(
// "/register/company",
// trimRequest.all,
// validate.register,
// controller.registerNewUser
// );

// require("../../config/passport");
// const passport = require("passport");
// const requireAuth = passport.authenticate("jwt", {
// session: false
// });

/*
 * Verify email route
 */
// router.post('/verify',
//   trimRequest.all,
//   validate.verify,
//   controller.verify
// )

/*
 * Login route
 */
// router.post("/login", trimRequest.all, validate.login, controller.login);

// /*
//  * Forgot password route
//  */
// router.post(
//   '/forgot',
//   trimRequest.all,
//   validate.forgotPassword,
//   controller.forgotPassword
// )

// /*
//  * Reset password route
//  */
// router.post(
//   '/reset',
//   trimRequest.all,
//   validate.resetPassword,
//   controller.resetPassword
// )

/*
 * Get new refresh token
 */
// router.get(
// '/getRefreshToken',
// requireAuth,
// trimRequest.all,
// controller.getRefreshToken;
// );
