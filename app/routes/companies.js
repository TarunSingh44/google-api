const companiesRouter = require('express').Router();
const companiesController = require('../controllers/companies');
const { authenticationMiddleWare } = require('../middleware/auth');
require("../../config/passport");
const passport = require("passport");

companiesRouter.use(authenticationMiddleWare);

/*
 * Get all companies
 */
companiesRouter.get("/", companiesController.getAllItems);
/*
 * Create new company
 */
// companiesRouter.post(
// 	"/",
// 	validate.createItem,
// 	companiesController.createItem
// );

companiesRouter.post(
	'/',
	companiesController.createNewCompany.validate,
	companiesController.createNewCompany,
  );
/*
 * Get company by id
 */
companiesRouter.get("/:id", companiesController.getItem);
/*
 * Update company
 */
companiesRouter.patch(
	"/:id",
	//validate.updateItem,
	companiesController.updateItem
);
/*
 * Update company member
 */
companiesRouter.patch(
	"/:id/:memberId",
	companiesController.updateMember
);
/*
 * Update one section within company "sections" array
 */
companiesRouter.patch(
	"/:companyId/:sheetId",
	companiesController.updateArray
);
/*
 * Delete company
 */
companiesRouter.delete(
	"/:id",
	//validate.deleteItem,
	companiesController.deleteItem
);

module.exports = companiesRouter;