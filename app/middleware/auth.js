const jwt = require('jsonwebtoken');
const { sendApiErrorResponse } = require('../utils/response.utils');
const { decryptEncryption } = require('../utils/encryption.utils');
const User = require('../models/user');
const { isValidObjectId } = require('../utils/mongoose.utils');
const environment = require('../../config/environment');

exports.authenticationMiddleWare = async function (req, res, next) {
  try {
    let accessToken = req.headers.authorization;
    accessToken = accessToken.replace('Bearer ', '').trim();
    accessToken = decryptEncryption(accessToken);
    const { _id } = jwt.decode(accessToken, environment.JWT_SECRET);
    const user = await User.findById(_id);
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (error) {
    sendApiErrorResponse(res, 'Access to this resource has been denied. Sign in and try again.', 401);
  }
};

exports.companyAuthenticationMiddleware = async function (req, res, next) {
  const companyId = req.query.companyId || req.body.companyId;
  try {
    if (companyId) {
      if (!isValidObjectId(req.query.companyId)) {
        throw new Error('Invalid value of company in request query');
      }
      // TODO: Company Id should be an array
      if (req.user.companyId.includes(companyId)) {
        throw new Error('You do not have permission to access this private document. Please contact the administrator and try again');
      }

      req.companyId = companyId;
      next();
      return;
    }
    next();
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
};

exports.activeSubscriptionAuthenticationMiddleware = async function (req, res, next) {
  try {
    const { user } = req;
    if (!user) throw new Error('Access to this resource has been denied. Sign in and try again.');
    next();
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
};
