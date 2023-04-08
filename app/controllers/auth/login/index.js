const { validateLoginRequestBody } = require('./validator');
const { sendApiErrorResponse, sendApiSuccessResponse } = require('../../../utils/response.utils');
const UserModel = require('../../../models/user');

async function LogInExistingUser(req, res) {
  try {
    const user = await UserModel.findByEmailAddress(req.body.email);
    if (!user) {
      throw new Error('You have supplied an invalid email or password');
    }
    if (!user.comparePassword(req.body.password)) {
      throw new Error('You have supplied an invalid email or password');
    }
    sendApiSuccessResponse(res, { user: await user.getPublicUserData(), accessToken: user.createAccessToken() }, 'Login successful!');
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}

LogInExistingUser.validate = validateLoginRequestBody;
module.exports = LogInExistingUser;
