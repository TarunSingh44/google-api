const yup = require('yup');
const { sendApiErrorResponse } = require('../../utils/response.utils');

async function validateCreateCalendarRequestBody(req, res, next) {
    try {
      const schema = yup.object({
        industry: yup.string()
          .required('Missing value of industry in request body')
          .min(3, 'industry name must have a minimum of 3 characters'),
      });
      req.body = await schema.validate(req.body);
      next();
    } catch (error) {
      sendApiErrorResponse(res, error);
    }
  }
  
  module.exports = { validateCreateCalendarRequestBody };
  