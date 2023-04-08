const yup = require('yup');
const { sendApiErrorResponse } = require('../../../utils/response.utils');

async function validateVerifyEmailRequestBody(req, res, next) {
  try {
    const schema = yup.object({
      code: yup.string()
        .required('Missing value of code in request body')
        .uuid('Invalid value of code in request body'),
    });
    req.query = await schema.validate(req.query);
    next();
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}

module.exports = { validateVerifyEmailRequestBody };
