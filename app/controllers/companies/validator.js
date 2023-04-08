const yup = require('yup');
const { sendApiErrorResponse } = require('../../utils/response.utils');

async function validateCreateNewCompanyRequestBody(req, res, next) {
  try {
    const schema = yup.object({
      companyName: yup.string()
        .required('Missing value of company name in request body')
        .min(3, 'Company name must have a minimum of 3 characters'),
    });
    req.body = await schema.validate(req.body);
    next();
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}

module.exports = { validateCreateNewCompanyRequestBody };
