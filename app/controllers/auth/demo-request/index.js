const { validateSendDemoRequest } = require("./validator");
const {
	sendApiErrorResponse,
	sendApiSuccessResponse,
} = require("../../../utils/response.utils");
var AWS = require("aws-sdk");
AWS.config.update({ region: "us-west-2" });

async function sendDemoRequest(req, res) {
	try {
		const { email, message } = req.body;
		const demoRequestEmail = `<html><p>New demo request from ${email}</p><p>They included the following message:</p><p>${message}</p></html>`;
		sesDemoRequest(demoRequestEmail);

		sendApiSuccessResponse(
			res,
			null,
			"A demo request has been sent to the support team. A representative will reach out to you soon."
		);
	} catch (error) {
		sendApiErrorResponse(res, error);
	}
}
sendDemoRequest.validate = validateSendDemoRequest;

function sesDemoRequest(userRequestEmail) {
	const params = {
		Destination: {
			ToAddresses: [`support@ondecentral.com`],
		},
		Message: {
			Body: {
				Html: {
					Data: userRequestEmail,
				},
			},
			Subject: {
				Data: "A new demo request",
			},
		},
		Source: `support@ondecentral.com`,
	};
	var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
		.sendEmail(params)
		.promise();
	return sendPromise;
}

module.exports = { sendDemoRequest };
