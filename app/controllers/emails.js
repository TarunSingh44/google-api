var AWS = require("aws-sdk");
AWS.config.update({ region: "us-west-2" });

exports.addUser = async (req, res) => {
	const {
		email,
		newUserFirstName,
		adminFirstName,
		adminLastName,
		newUserName,
		newUserPassword
	} = req.body;
	console.log(req.body);
	const addUserEmail = `<html><p style="font-weight: bold">Hello ${newUserFirstName},</p><p style="margin:15px 0 5px 0">${adminFirstName} ${adminLastName} has registered an account for you at founderskit.com.</p><p style="margin: 5px 0">Your current credentials are:</p><p style="margin:15px 0 5px 0; font-weight: bold">Username: ${newUserName}</p><p style="margin: 5px 0; font-weight: bold">Password: ${newUserPassword}</p><p style="margin:15px 0 5px 0">Please login at your earliest convenience and reset your password.</p><p style="margin:15px 0 5px 0">We hope you enjoy using our app! <p style="margin:15px 0 5px 0">We are always looking to grow as a platform,</p><p style="margin:15px 0 5px 0">so do not hesitate to reach out with any feedback.</p><p style="margin:15px 0 5px 0">Welcome aboard!</p><p style="margin: 5px 0">Sincerely,</p><p style="margin: 5px 0; font-weight: bold">The team at Founder's Kit</p></html>`;
	sesAddUser(email, adminFirstName, adminLastName, addUserEmail)
		.then(val => {
			// console.log(val);
			res.status(200).send("email sent");
		})
		.catch(error => {
			res.send("error sending email: " + error);
		});
};
function sesAddUser(emailTo, adminFirstName, adminLastName, addUserEmail) {
	const params = {
		Destination: {
			ToAddresses: [emailTo]
		},
		Message: {
			Body: {
				Html: {
					Data: addUserEmail
				}
			},
			Subject: {
				Data: "Invitation from " + adminFirstName + " " + adminLastName
			}
		},
		Source: "support@ondecentral.com"
	};
	var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
		.sendEmail(params)
		.promise();
	return sendPromise;
}

exports.forgotPassword = async (req, res) => {
	const { email, firstName, newPassword } = req.body;
	console.log(req.body);
	const forgotPasswordEmail = `
		<html>
			<p style="font-weight: bold">Hello ${firstName},</p>
			<p style="margin:15px 0 5px 0">Below you will find the temporary password that has been setup on your account.</p><p style="margin: 5px 0">You can use it immediately to log back into your account, but please take the time to reset your password.</p><p style="margin: 5px 0">You can do so in the "My Account" tab from your dashboard.</p><p style="font-weight: bold; margin: 20px 0">Your new password is: ${newPassword}</p><p style="margin: 5px 0">Thank you for using our platform!<p style="margin: 5px 0 15px 0">Please reach out at support@ondecentral.com with any feedback of how we can improve your experience.</p><p style="margin: 5px 0">Sincerely,</p><p style="font-weight: bold; margin: 5px 0">The team at Founder's Kit</p>
		</html>`;
	sesForgotEmail(email, forgotPasswordEmail)
		.then(val => {
			// console.log(val);
			res.status(200).send("email sent");
		})
		.catch(error => {
			res.send("error sending email: " + error);
		});
};
function sesForgotEmail(emailTo, forgotPasswordEmail) {
	const params = {
		Destination: {
			ToAddresses: [emailTo]
		},
		Message: {
			Body: {
				Html: {
					Data: forgotPasswordEmail
				}
			},
			Subject: {
				Data: "Founder's Table Password Reset"
			}
		},
		Source: "support@ondecentral.com"
	};
	var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
		.sendEmail(params)
		.promise();
	return sendPromise;
}

exports.demoRequest = async (req, res) => {
	const { userEmail, message } = req.body;
	console.log(req.body);
	const demoRequestEmail = `<html><p>New demo request from ${userEmail}</p><p>They included the following message:</p><p>${message}</p></html>`;
	sesDemoRequest(userEmail, demoRequestEmail)
		.then(val => {
			// console.log(val);
			res.status(200).send("email sent");
		})
		.catch(error => {
			res.send("error sending email: " + error);
		});
};
function sesDemoRequest(emailTo, userRequestEmail) {
	const params = {
		Destination: {
			ToAddresses: [emailTo]
		},
		Message: {
			Body: {
				Html: {
					Data: userRequestEmail
				}
			},
			Subject: {
				Data: "A new demo request"
			}
		},
		Source: "support@ondecentral.com"
	};
	var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
		.sendEmail(params)
		.promise();
	return sendPromise;
}
