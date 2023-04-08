const model = require("../models/user");
const db = require("../middleware/db");
const controller = require("../controllers/auth/user");
const user = require("../models/user");
const crypto = require("crypto");


exports.square = require('./webhooks/square');

exports.subscriptionWebhook = async (req, res) => {
	const signature = req.headers["x-square-hmacsha256-signature"];

	const NOTIFICATION_URL = `https://api.stage.founderstable.xyz/webhooks/subscriptions`;

	// The signature key defined for the subscription.
	const { SIGNATURE_KEY } = process.env;

	// isFromSquare generates a signature from the url and body and compares it to the Square signature header.
	function isFromSquare(signature, body) {
		const hmac = crypto.createHmac("sha256", SIGNATURE_KEY);
		hmac.update(NOTIFICATION_URL + JSON.stringify(body));
		const hash = hmac.digest("base64");

		return hash === signature;
	}

	try {
		if (isFromSquare(signature, req.body)) {
			res.sendStatus(200);
		} else {
			res.sendStatus(400);
			return;
		}

		const requestBody = req.body;

		// if (requestBody.type === "subscription.created") {
		console.log(requestBody);
		// const userSquareId = requestBody.data.object.subscription.customer_id;
		// console.log(userSquareId);
		// const user = controller.getUser(`/users/square/${userSquareId}`);
		// console.log(user);
		// const userId = user.data._id;
		// const userSquareSubscription = requestBody.data.object.subscription.id;
		// const updateUser = controller.updateUser(`user/${userId}`, {
		// 	subscription: {
		// 	name: user.data.subscription.name,
		// 	squareId: user.data.subscription.squareId,
		// 	squareSubscriptionId: userSquareSubscription,
		// 	status: true,
		// 	createdAt: user.data.subscription.createdAt,
		// 	renewalDate: user.data.subscription.renewalDate
		// }
		// });
		// console.log(updateUser);
		// } else if (requestBody.type === "subscription.updated") {
		// if (requestBody.data.object.subscription.status !== "ACTIVE") {
		console.log(requestBody);
		// const userSquareId = requestBody.data.object.subscription.customer_id;
		// console.log(userSquareId);
		// const user = controller.getUser(`/users/square/${userSquareId}`);
		// console.log(user);
		// const userId = user.data._id;
		// let newDay = new Date();
		// let today = String(newDay.toISOString());
		// let day = parseInt(today.slice(8,10));
		// let month = today.slice(5,7);
		// let year = parseInt(today.slice(0,4));
		// let currentDate = `${year}` + `${month}` + `${day}`;
		// const updateUser = controller.updateUser(`user/${userId}`, {
		// 	subscription: {
		// 	name: user.data.subscription.name,
		// 	squareId: user.data.subscription.squareId,
		// 	squareSubscriptionId: user.data.subscription.squareSubscriptionId,
		// 	status: false;
		// 	cancellationDate: currentDate,
		// 	createdAt: user.data.subscription.createdAt,
		// }
		// });
		// console.log(updateUser);
		// } else {
		// 	console.log(requestBody);
		// }
		// } else {
		// 	console.log(requestBody);
		// }
	} catch (err) {
		console.log(err);
	}
};
