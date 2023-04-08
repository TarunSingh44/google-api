const { validateVerifyEmailRequestBody } = require('./validator');
const EmailVerificationTokenModel = require('../../../models/email-verificaition-token');
const UserModel = require('../../../models/user');
const { sendApiErrorResponse, sendApiSuccessResponse } = require('../../../utils/response.utils');
const { convertHoursToMilliseconds } = require('../../../utils/api.utils');
const environment = require('../../../../config/environment');

async function VerifyEmail(req, res) {
  try {
    const emailVerificationToken = await EmailVerificationTokenModel.findOne({
      code: req.query.code,
    });
    if (!emailVerificationToken) {
      throw new Error('Invalid or expired verification link. Please check your email or request a new verification link and try again');
    }

    // This guard prevents a user from verifying another user's email
    if (emailVerificationToken.userId?.toString() !== req.query.userId) {
      throw new Error('Invalid or expired verification link. Please check your email or request a new verification link and try again');
    }

    const expiryDateInMilliseconds = new Date(emailVerificationToken.createdAt).getTime()
      + convertHoursToMilliseconds(12);

    if (expiryDateInMilliseconds < Date.now()) {
      throw new Error('Invalid or expired verification link. Please check your email or request a new verification link and try again');
    }

    const user = await UserModel.findById(req.query.userId);
    if (user.email.endsWith('@ondecentral.com') || user.email.endsWith('@founderskit.org') || user.email.endsWith('@foundersk.it')) {
      await user.update({ isEmailVerified: true, role: 'admin' });
    } else {
      await user.update({ isEmailVerified: true });
    }
    sendApiSuccessResponse(res, null, 'Your email has been verified successfully!');
    await emailVerificationToken.deleteOne();
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}
VerifyEmail.validate = validateVerifyEmailRequestBody;

async function SendEmailVerificationToken(req, res) {
  try {
    const emailVerificationToken = await EmailVerificationTokenModel.Upsert(req.user);
    sendApiSuccessResponse(
      res,
      environment.NODE_ENV === 'production' ? null : emailVerificationToken,
      'An email verification link has been sent to your registered email address. Kindly use the link to verify your email address ',
    );
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}

module.exports = { VerifyEmail, SendEmailVerificationToken };
