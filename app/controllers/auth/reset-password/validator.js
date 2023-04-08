const yup = require("yup");
const { sendApiErrorResponse } = require("../../../utils/response.utils");

async function validateResetPasswordBody(req, res, next) {
	const schema = yup.object({
		newPassword: yup
			.string()
			.required("Missing value of new password in request body"),
		oldPassword: yup
			.string()
			.required("Missing value of old password in request body"),
	});

	try {
		req.body = await schema.validate(req.body);
		next();
	} catch (error) {
		sendApiErrorResponse(res, error);
	}
}

module.exports = { validateResetPasswordBody };
