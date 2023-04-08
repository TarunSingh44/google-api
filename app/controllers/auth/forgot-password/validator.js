const yup = require("yup");
const { sendApiErrorResponse } = require("../../../utils/response.utils");

async function validateSetTemporaryPasswordBody(req, res, next) {
	const schema = yup.object({
		email: yup
			.string()
			.required("Missing value of email in request body")
			.email("Invalid value of email supplied in request body"),
	});

	try {
		req.body = await schema.validate(req.body);
		next();
	} catch (error) {
		sendApiErrorResponse(res, error);
	}
}

async function validateSendPasswordResetLinkBody(req, res, next) {
	const schema = yup.object({
		email: yup
			.string()
			.required("Missing value of email in request body")
			.email("Invalid value of email supplied in request body"),
	});

	try {
		req.body = await schema.validate(req.body);
		next();
	} catch (error) {
		sendApiErrorResponse(res, error);
	}
}

async function validateResetPasswordBody(req, res, next) {
	const schema = yup.object({
		password: yup
			.string()
			.required("Missing value of password in request body")
			.min(5, "Password requires a minimum of 5 characters"),
		code: yup
			.string()
			.required("Missing value of code in request body")
			.uuid("Invalid value of code in request body"),
	});

	try {
		req.body = await schema.validate(req.body);
		next();
	} catch (error) {
		sendApiErrorResponse(res, error);
	}
}

module.exports = {
	validateSetTemporaryPasswordBody,
	validateSendPasswordResetLinkBody,
	validateResetPasswordBody,
};
