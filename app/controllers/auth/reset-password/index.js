const bcrypt = require('bcryptjs');
const { validateResetPasswordBody } = require('./validator');
const {
  sendApiErrorResponse,
  sendApiSuccessResponse,
} = require('../../../utils/response.utils');

async function ResetPassword(req, res) {
  try {
    const { user, body } = req;
    const { newPassword, oldPassword } = body;

    if (!user.comparePassword(oldPassword)) {
      throw new Error(
        "The old password you provided does not match what's currently on file",
      );
    } else if (user.comparePassword(newPassword)) {
      throw new Error(
        "The new password you provided is the same as the old one. Please choose a different password.",
      );
    } else {
      const updatedUser = await user.updateOne(
        { password: bcrypt.hashSync(newPassword) },
      );
      sendApiSuccessResponse(res, null, 'Password reset successful!');
    }
    
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}
ResetPassword.validate = validateResetPasswordBody;

module.exports = { ResetPassword };
