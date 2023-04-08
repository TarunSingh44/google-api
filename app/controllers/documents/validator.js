const yup = require('yup');
const { sendApiErrorResponse } = require('../../utils/response.utils');

async function validateCreateDocumentRequestBody(req, res, next) {
  const schema = yup.object({
    title: yup.string()
      .required('Missing document name in request body'),
    companyId: yup.string(),
  });

  try {
    req.body = await schema.validate(req.body);
    next();
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}

async function validateUpdateDocumentRequestBody(req, res, next) {
  const schema = yup.object({
    title: yup.string().min(3),
    spreadsheetData: yup.object(),
  });

  try {
    req.body = await schema.validate(req.body);
    next();
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}

module.exports = { validateCreateDocumentRequestBody, validateUpdateDocumentRequestBody };
