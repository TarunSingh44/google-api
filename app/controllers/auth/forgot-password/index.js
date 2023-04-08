const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const AWS = require('aws-sdk');
const {
  validateSetTemporaryPasswordBody,
  validateSendPasswordResetLinkBody,
  validateResetPasswordBody,
} = require('./validator');
const UserModel = require('../../../models/user');
const {
  sendApiErrorResponse,
  sendApiSuccessResponse,
} = require('../../../utils/response.utils');
const environment = require('../../../../config/environment');
const PasswordResetTokenModel = require('../../../models/password-reset-token');
const { convertHoursToMilliseconds } = require('../../../utils/api.utils');

AWS.config.update({ region: 'us-west-2' });

async function SetTemporaryPassword(req, res) {
  try {
    const user = await UserModel.findByEmailAddress(req.body.email);
    if (!user) {
      throw new Error(
        'This email address does not belong to a user. If you own this email address, kindly create an account to use our services',
      );
    }
    const { email, firstName, _id } = user;

    let newPassword = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 9; i++) {
      newPassword += characters.charAt(
        Math.floor(Math.random() * charactersLength),
      );
    }

    const newUser = await UserModel.updateOne(
      { _id: _id },
      { password: bcrypt.hashSync(newPassword) } // update the password field
    );

    const forgotPasswordEmail = `<html><p style="font-weight: bold">Hello ${firstName},</p><p style="margin:15px 0 5px 0">Below you will find the temporary password that has been setup on your account.</p><p style="margin: 5px 0">You can use it immediately to log back into your account, but please take the time to reset your password.</p><p style="margin: 5px 0">You can do so in the "My Account" tab from your dashboard.</p><p style="font-weight: bold; margin: 20px 0">Your new password is: ${newPassword}</p><p style="margin: 5px 0">Thank you for using our platform!<p style="margin: 5px 0 15px 0">Please reach out at support@ondecentral.com with any feedback of how we can improve your experience.</p><p style="margin: 5px 0">Sincerely,</p><p style="font-weight: bold; margin: 5px 0">The team at Founder's Kit</p></html>`;
    const sendEmail = await sesForgotEmail(email, forgotPasswordEmail);

    sendApiSuccessResponse(
      res,
      null,
      'A temporary password has been sent to your email. Please log in and create your own password.',
    );
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}
SetTemporaryPassword.validate = validateSetTemporaryPasswordBody;
function sesForgotEmail(emailTo, forgotPasswordEmail) {
  const params = {
    Destination: {
      ToAddresses: [emailTo],
    },
    Message: {
      Body: {
        Html: {
          Data: forgotPasswordEmail,
        },
      },
      Subject: {
        Data: "Founder's Kit Password Reset",
      },
    },
    Source: 'support@ondecentral.com',
  };
  const sendPromise = new AWS.SES({ apiVersion: '2010-12-01' })
    .sendEmail(params)
    .promise();
  return sendPromise;
}

//* ******************************/
//* ******************************/
//* ******************************/

async function SendPasswordResetLink(req, res) {
  try {
    const user = await UserModel.findByEmailAddress(req.body.email);
    if (!user) {
      throw new Error(
        'This email address does not belong to a user. If you own this email address, kindly create an account to use our services',
      );
    }

    const passwordResetToken = await PasswordResetTokenModel.findOneAndUpdate(
      { userId: user.id },
      { code: uuid().toString(), createdAt: Date.now(), userId: user.id },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    const passwordResetLink = `${environment.WEB_APP_URL}?code=${passwordResetToken.code}`;
    sendApiSuccessResponse(
      res,
      environment.NODE_ENV !== 'production' ? { url: passwordResetLink } : null,
      'A link to reset your password has been sent to your registered email. Kindly use the link to reset your password',
    );
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}
SendPasswordResetLink.validate = validateSendPasswordResetLinkBody;

async function ResetPassword(req, res) {
  try {
    const passwordResetToken = await PasswordResetTokenModel.findOne({
      code: req.body.code,
    });

    if (!passwordResetToken) {
      throw new Error(
        'This link is invalid or has expired. Kindly request a new link and try again',
      );
    }
    if (
      new Date(passwordResetToken.createdAt).getTime()
				+ convertHoursToMilliseconds(12)
			< Date.now()
    ) {
      throw new Error(
        'This link is invalid or has expired. Kindly request a new link and try again',
      );
    }
    await UserModel.updateOne(
      { _id: passwordResetToken.userId },
      { password: bcrypt.hashSync(req.body.password) },
    );
    sendApiSuccessResponse(
      res,
      null,
      'You have successfully reset your password. Log in to continue using our services',
    );
    await passwordResetToken.deleteOne();
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}
ResetPassword.validate = validateResetPasswordBody;

module.exports = { SetTemporaryPassword, SendPasswordResetLink, ResetPassword };
