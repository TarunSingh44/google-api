const yup = require("yup");
const { sendApiErrorResponse } = require("../../../utils/response.utils");

async function validateCreateTemplateRequestBody(req, res, next) {
	const schema = yup.object({
		title: yup
			.string()
			.min(3)
			.required("Missing template name in request body"),
		spreadsheetData: yup
			.object()
			.required("Missing template data in request body"),
	});

	try {
		req.body = await schema.validate(req.body);
		next();
	} catch (error) {
		sendApiErrorResponse(res, error);
	}
}

async function validateUpdateTemplateRequestBody(req, res, next) {
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

module.exports = {
	validateCreateTemplateRequestBody,
	validateUpdateTemplateRequestBody,
};
