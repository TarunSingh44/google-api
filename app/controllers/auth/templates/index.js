const TemplateModel = require("../../../models/template");
const {
	sendApiErrorResponse,
	sendApiSuccessResponse,
} = require("../../../utils/response.utils");

async function getFreeTemplates(req, res) {
	try {
		sendApiSuccessResponse(
			res,
			await TemplateModel.find({
				type: "free",
				published: true,
			}),
			"Successfully fetched signed in user data"
		);
	} catch (error) {
		sendApiErrorResponse(res, error);
	}
}
async function getPremiumTemplates(req, res) {
	try {
		sendApiSuccessResponse(
			res,
			await TemplateModel.find({
				type: "premium",
				published: true,
			}),
			"Successfully fetched signed in user data"
		);
	} catch (error) {
		sendApiErrorResponse(res, error);
	}
}

module.exports = { getFreeTemplates, getPremiumTemplates };
