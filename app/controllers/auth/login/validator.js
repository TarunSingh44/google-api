const yup = require('yup');
const { sendApiErrorResponse } = require('../../../utils/response.utils');

exports.validateLoginRequestBody = async function (req, res, next) {
  try {
    const schema = yup.object({
      password: yup.string()
        .required('Missing value of password in request body'),
      email: yup.string()
        .required('Missing value of email in request body')
        .email('Please provide a valid email address'),
    });
    req.body = await schema.validate(req.body);
    next();
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
};
