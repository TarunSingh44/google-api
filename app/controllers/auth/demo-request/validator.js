const yup = require("yup");
const { sendApiErrorResponse } = require("../../../utils/response.utils");

async function validateSendDemoRequest(req, res, next) {
	const schema = yup.object({
		email: yup
			.string()
			.required("Missing value of email in request body")
			.email("Invalid value of email supplied in request body"),
		message: yup.string().required(),
	});

	try {
		req.body = await schema.validate(req.body);
		next();
	} catch (error) {
		sendApiErrorResponse(res, error);
	}
}

module.exports = {
	validateSendDemoRequest,
};
