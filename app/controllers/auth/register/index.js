const AWS = require('aws-sdk');
const validator = require('./validator');
const UserModel = require('../../../models/user');
const { sendApiErrorResponse, sendApiSuccessResponse } = require('../../../utils/response.utils');
const EmailVerificationTokenModel = require('../../../models/email-verificaition-token');
const environment = require('../../../../config/environment');

AWS.config.update({ region: 'us-west-2' });
async function RegisterNewUser(req, res) {
  try {
    const existingAccountWithEmailAddress = await UserModel.findByEmailAddress(req.body.email);
    if (existingAccountWithEmailAddress) {
      throw new Error('An account with this email address already exists.');
    }
    const user = new UserModel(req.body);
    await user.save();
    sendApiSuccessResponse(
      res,
      { user: await user.getPublicUserData(), accessToken: user.createAccessToken() },
      'Your Founders Kit account has been successfully created.',
    );
    const verifyUser = await EmailVerificationTokenModel.Upsert(user);
    const verifyLink = `${environment.WEB_APP_URL}/auth/verify-email?code=${verifyUser.code}&userId=${verifyUser.userId}`;
    const verifyEmail = `<html><a href="${verifyLink}">Click here.</a></html>`;
    const sendEmail = await sesVerifyEmail(req.body.email, verifyEmail);
    console.log(sendEmail);
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}

function sesVerifyEmail(emailTo, verifyEmail) {
  const params = {
    Destination: {
      ToAddresses: [emailTo],
    },
    Message: {
      Body: {
        Html: {
          Data: verifyEmail,
        },
      },
      Subject: {
        Data: 'Please verify your account.',
      },
    },
    Source: 'support@ondecentral.com',
  };
  const sendPromise = new AWS.SES({ apiVersion: '2010-12-01' })
    .sendEmail(params)
    .promise();
  return sendPromise;
}

RegisterNewUser.validate = validator;
module.exports = RegisterNewUser;
