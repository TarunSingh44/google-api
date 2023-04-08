const {
	validateCreateTemplateRequestBody,
	validateUpdateTemplateRequestBody,
} = require("./validator");
const TemplateModel = require("../../../models/template");
const {
	sendApiSuccessResponse,
	sendApiErrorResponse,
} = require("../../../utils/response.utils");
const { isValidObjectId } = require("../../../utils/mongoose.utils");

async function createNewTemplate(req, res) {
	try {
		const { user } = req;
		const template = new TemplateModel({
			...req.body,
			createdBy: user.id,
		});
		await template.save();
		sendApiSuccessResponse(
			res,
			template,
			"You have successfully created a Template"
		);
	} catch (error) {
		sendApiErrorResponse(res, error);
	}
}
createNewTemplate.validate = validateCreateTemplateRequestBody;

async function getAllTemplates(req, res) {
	// TODO: Add pagination to find queries
	try {
		let templates = [];

		templates = await TemplateModel.find({});

		sendApiSuccessResponse(res, templates, "Successfully retrieved templates");
	} catch (error) {
		sendApiErrorResponse(res, error);
	}
}

async function updateSingleTemplate(req, res) {
	try {
		const { params, body } = req;
		const templateId = params.id;
		let templateScopeQuery = {};

		if (!isValidObjectId(params.id)) {
			throw new Error("Invalid value of id in request param");
		}
		const template = await TemplateModel.findByIdAndUpdate(templateId, {
			title: body.title,
			spreadsheetData: body.spreadsheetData,
		});

		sendApiSuccessResponse(
			res,
			template,
			"You have successfully updated this template"
		);
	} catch (error) {
		sendApiErrorResponse(res, error);
	}
}
updateSingleTemplate.validate = validateUpdateTemplateRequestBody;

module.exports = {
	createNewTemplate,
	getAllTemplates,
	updateSingleTemplate,
};
