const yup = require('yup');
const { sendApiErrorResponse } = require('../../../utils/response.utils');

const registerRequestBodySchema = yup.object({
  password: yup.string()
    .required('Missing value of password in request body')
    .min(5, 'Password requires a minimum of 5 characters'),
  email: yup.string()
    .required('Missing value of email in request body')
    .email('Please provide a valid email address'),
  lastName: yup.string()
    .required('Missing value of last name in request body'),
  firstName: yup.string()
    .required('Missing value of first name in request body'),
});

async function validateRegisterRequestBody(req, res, next) {
  try {
    await registerRequestBodySchema.validate(req.body);
    next();
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}

module.exports = validateRegisterRequestBody;
