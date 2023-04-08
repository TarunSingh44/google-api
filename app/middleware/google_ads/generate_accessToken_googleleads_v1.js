const fetch = require("node-fetch");
const fs = require("fs");
const token = require("./tokens");
require("dotenv").config();

const token_url = "https://oauth2.googleapis.com/token";

const tokenParams = {
	refresh_token: token["Refresh Token"],
	client_id: process.env.CLIENT_IDS,
	client_secret: process.env.CLIENT_SECRETS,
	grant_type: "refresh_token",
};

fetch(token_url, {
	method: "POST",
	body: new URLSearchParams(tokenParams),
	headers: {
		"Content-Type": "application/x-www-form-urlencoded",
	},
})
	.then((response) => {
		if (response.ok) {
			return response.json();
		}
		throw new Error("Error:", response.statusText);
	})
	.then((data) => {
		const datas = {
			// data to write to file
			"Access Token": data.access_token,
			"Refresh Token": token["Refresh Token"],
		};

		fs.writeFile("tokens.json", JSON.stringify(datas), { flag: "w" }, (err) => {
			console.log(`Data written to tokens.json`);
		});
	})
	.catch((error) => {
		console.error(error);
	});
