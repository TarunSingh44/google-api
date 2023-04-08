const fs = require("fs");
const fetch = require("node-fetch");
require("dotenv").config();

// # Set the OAuth 2.0 Playground endpoint URL
const oauth_url = "https://developers.google.com/oauthplayground";

// # Set the Google API scopes that you want to use
const scopes = "https://www.googleapis.com/auth/adwords";

// # Define the authorization endpoint URL
const auth_url = "https://accounts.google.com/o/oauth2/v2/auth";

// # Define the token endpoint URL
const token_url = "https://oauth2.googleapis.com/token";

// # Define the parameters for the authorization request
auth_params = {
	response_type: "code",
	client_id: process.env.CLIENT_IDS,
	redirect_uri: "https://developers.google.com/oauthplayground",
	scope: scopes,
	access_type: "offline",
	prompt: "consent",
};

var auth_urls = auth_url + "?" + "&";
for (const key in auth_params) {
	auth_urls += `${key}=${auth_params[key]}` + "&";
}
console.log(auth_urls);

var query = require("cli-interact").question;
var answer = query("Enter the authorization code:");

const token_params = {
	code: answer,
	client_id: process.env.CLIENT_IDS,
	client_secret: process.env.CLIENT_SECRETS,
	redirect_uri: "https://developers.google.com/oauthplayground",
	grant_type: "authorization_code",
};

fetch(token_url, { method: "POST", body: new URLSearchParams(token_params) })
	.then((response) => {
		if (response.ok) {
			return response.json();
		}
		throw new Error("Error:", response.statusText);
	})
	.then((token_data) => {
		const access_token = token_data.access_token;
		const refresh_token = token_data.refresh_token;
		console.log("Access token:", access_token);
		console.log("Refresh token:", refresh_token);
		const datas = {
			// data to write to file
			"Access Token": access_token,
			"Refresh Token": refresh_token,
		};
		fs.writeFile("tokens.json", JSON.stringify(datas), { flag: "w" }, (err) => {
			console.log(`Data written to tokens.json`);
		});
	})
	.catch((error) => {
		console.error(error);
	});
