const environment = require("../../config/environment");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const generatemetrics = require("./google_ads/generateMetrics_googleads_v1");

function readCsvFile() {
	return new Promise((resolve, reject) => {
		const results = [];

		const filePath = path.join(__dirname, "ad_data.csv");
		fs.createReadStream(filePath)
			.pipe(csv())
			.on("data", (data) => results.push(data))
			.on("error", (error) => reject(error))
			.on("end", () => resolve(results));
	});
}

exports.getGoogleAdsCampaigns = async function (keywords) {
	try {
		const metrics = await generatemetrics.getmetrics(keywords);
		return metrics;
	} catch (error) {
		return [];
	}
};

// exports.getGoogleAdsCampaigns = async function (keywords) {
// 	try {
// 		const results = await readCsvFile();

// 		// loop through the array and generate random cost for each object
// 		results.forEach(function (obj) {
// 			obj["Cost (USD)"] = Math.random() * 1000; // generate a random number between 0 and 1000
// 			obj["CPC"] = (Math.random() * 10).toFixed(2); // generate a random number between 0 and 10

// 			let cpc = parseFloat(obj.CPC); // parse CPC value as float
// 			if (cpc < 3) {
// 				obj.Cost_color = "Green";
// 			} else if (cpc >= 3 && cpc <= 5) {
// 				obj.Cost_color = "Yellow";
// 			} else {
// 				obj.Cost_color = "Red";
// 			}
// 		});
// 		return results;
// 	} catch (error) {
// 		console.error(error);
// 		return [];
// 	}
// };

// Set up authentication headers
// const headers = {
// 	Authorization: `Bearer ${environment.access_token}`,
// 	"developer-token": `${environment.DEVELOPER_TOKEN}`,
// };

// // Set up the request payload
// const payload = {
//   query: "SELECT campaign.id, campaign.name FROM campaign",
//   customerId: '${environment.CUSTOMER_ID}',
// };

// // Make the API request
// const url = `https://googleads.googleapis.com/v13/customers/${environment.CUSTOMER_ID}/googleAds:search`;
// exports.getGoogleAdsCampaigns = async function (keywords) {
// 	const response = await (
// 		await import("node-fetch")
// 	).default(url, {
// 		method: "POST",
// 		headers: headers,
// 		body: JSON.stringify(payload),
// 	});

// 	if (response.ok) {
// 		const data = await response.json();
// 		const campaigns = data["results"];
// 		for (const campaign of campaigns) {
// 			console.log(
// 				`Campaign ID: ${campaign["campaign"]["id"]}, Campaign name: ${campaign["campaign"]["name"]}`
// 			);
// 		}
// 	} else {
// 		console.error(
// 			`Request failed with status code ${response.status}: ${response.statusText}`
// 		);
// 		const errorText = await response.text();
// 		throw new Error(
// 			`Request failed with status code ${response.status}: ${response.statusText}. Error message: ${errorText}`
// 		);
// 	}
// };
