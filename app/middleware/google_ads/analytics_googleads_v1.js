//Loding Json Files and required dependencies.
const fetch = require("node-fetch");
const payload_campaign = require("./payload_campaign");
const payload_ad = require("./payload_ad");

require("dotenv").config();

// Loading the Secret Keys
const DEVELOPER_TOKEN = process.env.DEVELOPER_TOKENS;
const CUSTOMER_ID = process.env.CUSTOMER_IDS;
const ACCESS_TOKEN = require("./tokens");

// Set up authentication headers
const headers = {
	Authorization: `Bearer ${ACCESS_TOKEN["Access Token"]}`,
	"developer-token": DEVELOPER_TOKEN,
};

const url = `https://googleads.googleapis.com/v13/customers/${CUSTOMER_ID}/googleAds:search`;

//Make the API request for Payload_campaign
fetch(url, {
	method: "POST",
	headers: headers,
	body: JSON.stringify(payload_campaign),
})
	.then((response) => {
		if (response.ok) {
			return response.json();
		} else {
			console.log(
				`Request failed with status code ${response.status}: ${response.statusText}`
			);
			console.log(response.text());
		}
	})
	.then((data) => {
		const campaigns = data["results"];
		console.log(campaigns);
	})
	.catch((error) => console.error(error));

//Make the API request for Payload_ad
fetch(url, {
	method: "POST",
	headers: headers,
	body: JSON.stringify(payload_ad),
})
	.then((response) => {
		if (response.ok) {
			return response.json();
		} else {
			console.log(
				`Request failed with status code ${response.status}: ${response.statusText}`
			);
			console.log(response.text());
		}
	})
	.then((data) => {
		const campaigns = data["results"];
		console.log(campaigns);
	})
	.catch((error) => console.error(error));
