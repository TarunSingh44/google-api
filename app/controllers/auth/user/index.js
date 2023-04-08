const { sendApiSuccessResponse } = require('../../../utils/response.utils');

async function GetCurrentlySignedInUser(req, res) {
  sendApiSuccessResponse(
    res,
    await req.user.getPublicUserData(),
    'Successfully fetched signed in user data',
  );
}

module.exports = { GetCurrentlySignedInUser };
