const { validateCreateCalendarRequestBody } = require("./validator");
const {
	sendApiErrorResponse,
	sendApiSuccessResponse,
} = require("../../utils/response.utils");
const CalendarModel = require("../../models/calendar");
const { isValidObjectId } = require("../../utils/mongoose.utils");
const googleads = require("../../middleware/googleads");

async function createNewCalendar(req, res) {
	try {
		const { user } = req;
		const calendar = new CalendarModel({
			...req.body,
			createdBy: user.id,
		});
		await calendar.save();
		sendApiSuccessResponse(
			res,
			calendar,
			"You have successfully created a new calendar"
		);
	} catch (error) {
		sendApiErrorResponse(res, error);
	}
}
createNewCalendar.validate = validateCreateCalendarRequestBody;

async function getCalendar(req, res) {
	try {
		let document = {};
		const { user } = req;

		calendar = await CalendarModel.findOne({ createdBy: user.id });

		sendApiSuccessResponse(
			res,
			document,
			"Successfully retrieved record calendar"
		);
	} catch (error) {
		sendApiErrorResponse(res, error);
	}
}

async function updateCalendar(req, res) {
	try {
		const { user, params, body } = req;
		const calendarId = params.id;
		let documentScopeQuery = {};

		if (!isValidObjectId(params.id)) {
			throw new Error("Invalid value of id in request param");
		}

		const calendar = await CalendarModel.findOneAndUpdate(
			{
				...documentScopeQuery,
				createdBy: user.id,
				_id: calendarId,
			},
			{
				description: body.description,
				keywords: body.keywords,
				campaigns: body.campaigns,
				selectedDates: body.selectedDates,
			},
			{
				new: true,
			}
		);
		sendApiSuccessResponse(
			res,
			calendar,
			"You have successfully updated this calendar"
		);
	} catch (error) {
		sendApiErrorResponse(res, error);
	}
}
updateCalendar.validate = validateCreateCalendarRequestBody;

async function getKeywordValues(req, res) {
	try {
		const { keyword } = req.body;
		values = await googleads.getGoogleAdsCampaigns(keyword);

		sendApiSuccessResponse(
			res,
			values,
			"Successfully retrieved keyword values"
		);
	} catch (Error) {
		sendApiErrorResponse(res, Error);
	}
}

module.exports = {
	createNewCalendar,
	getCalendar,
	updateCalendar,
	getKeywordValues,
};
