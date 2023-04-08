const yup = require('yup');
const { sendApiErrorResponse } = require('../../../utils/response.utils');

async function validateSendCompanyInviteToEmailAddressRequestBody(req, res, next) {
  try {
    const schema = yup.object({
      email: yup.string()
        .required('Missing value of email in request body')
        .email('Invalid value of email in request body'),
      subscriptionPlanId: yup.string(),
    });
    req.body = await schema.validate(req.body);
    next();
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}

module.exports = { validateSendCompanyInviteToEmailAddressRequestBody };
