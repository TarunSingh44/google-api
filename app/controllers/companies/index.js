const model = require("../../models/company");
const { matchedData } = require("express-validator");
const utils = require("../../middleware/utils");
const db = require("../../middleware/db");

/********************
 * Public functions *
 ********************/


const { validateCreateNewCompanyRequestBody } = require("./validator");
const {
	sendApiErrorResponse,
	sendApiSuccessResponse,
} = require("../../utils/response.utils");
const CompanyModel = require("../../models/company");
const {
	sendCompanyInviteToEmailAddress,
	verifyInviteAndAddToCompany,
} = require("./invites");
const CompanyMemberModel = require("../../models/company-member");

async function createNewCompany(req, res) {
	try {
		const { user, body } = req;
		const company = await new CompanyModel({
			name: body.companyName,
			createdBy: user.id,
		}).save();
		const member = await new CompanyMemberModel({
			userId: user.id,
			companyId: company.id,
			role: "administrator",
		}).save();
		await company.update(
			{
				$push: {
					members: member._id,
				},
			},
			{ new: true }
		);
		await user.update({
			$push: {
				companies: { _id: company._id },
			},
		});
		sendApiSuccessResponse(res, company);
	} catch (error) {
		sendApiErrorResponse(res, error);
	}
}
createNewCompany.validate = validateCreateNewCompanyRequestBody;


/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
createItem = async (req, res) => {
	try {
		const userID = req.user._id;
		req = matchedData(req);
		req.createdBy = userID;
		res.status(201).json(await db.createItem(req, model));
	} catch (error) {
		utils.handleError(res, error);
	}
};

/**
 * Get all items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
getAllItems = async (req, res) => {
	// admin
	try {
		res.status(200).json(await db.getItems(req, model));
	} catch (error) {
		utils.handleError(res, error);
	}
};

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
getItem = async (req, res) => {
	try {
		const companyID = req.params.id;
		res.status(200).json(await db.getItem(companyID, model));
	} catch (error) {
		utils.handleError(res, error);
	}
};

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
updateItem = async (req, res) => {
	try {
		const id = req.params.id;
		console.log(req.body);
		res.status(200).json(await db.updateItem(id, model, req.body));
	} catch (error) {
		utils.handleError(res, error);
	}
};
/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
updateMember = async (req, res) => {
	try {
		const companyId = req.params.id;
		const memberId = req.params.memberId;
		console.log(req.body);
		res
			.status(200)
			.json(
				await db.updateItem(
					{ _id: companyId, members: { userId: memberId } },
					model,
					req.body
				)
			);
	} catch (error) {
		utils.handleError(res, error);
	}
};
/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
updateArray = async (req, res) => {
	try {
		const companyId = req.params.companyId;
		console.log(companyId);
		const sheetId = req.params.sheetId;
		const id = { id: companyId, "sections._id": `${sheetId}` };
		// console.log(id);
		console.log(req.body);
		res.status(200).json(await db.updateItem(companyId, model, req.body));
		// res.status(200).json(await db.updateItem(id, model, req.body));
	} catch (error) {
		utils.handleError(res, error);
	}
};

/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
deleteItem = async (req, res) => {
	try {
		req = matchedData(req);
		const id = await utils.isIDGood(req.id);
		res.status(200).json(await db.deleteItem(id, model));
	} catch (error) {
		utils.handleError(res, error);
	}
};

module.exports = {
	createNewCompany,
	sendCompanyInviteToEmailAddress,
	verifyInviteAndAddToCompany,
	deleteItem,
	createItem,
	getAllItems,
	getItem,
	updateItem,
	updateMember,
	updateArray,
	deleteItem,
};