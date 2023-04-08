const {
	sendApiSuccessResponse,
	sendApiErrorResponse,
} = require("../../utils/response.utils");

const environment = require("../../../config/environment");
const Mixpanel = require("mixpanel");

async function sendMixPanelEvent(req, res) {
	try {
		//Mix Panel Initialization
		const mixpanel = Mixpanel.init(environment.MIXPANEL_KEY);

		const { source, title } = req.body;
		const ipAddress = req.headers["x-real-ip"] || req.connection.remoteAddress;

		const eventProps = {
			source: source,
			ip: ipAddress,
			Viewed: true,
		};
		mixpanel.track(title, eventProps);

		sendApiSuccessResponse(res, "MixPanel event saved");
	} catch (error) {
		sendApiErrorResponse(res, error);
	}
}

module.exports = {
	sendMixPanelEvent,
};
