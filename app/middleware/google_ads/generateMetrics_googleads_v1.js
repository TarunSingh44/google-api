const { spawn } = require("child_process");
require("dotenv").config();

const main = (keyword) => {
	return new Promise((resolve, reject) => {
		const customerIds = process.env.CUSTOMER_IDS;
		const path = require("path");
		const campaign = spawn("python", [
			path.join(__dirname, "generate_metrics.py"),
			customerIds,
			keyword,
		]);

		let output = "";

		campaign.stdout.on("data", (data) => {
			output += data;
		});

		campaign.stderr.on("data", (data) => {
			console.log(`Error: ${data}`);
			reject(data);
		});

		campaign.on("close", (code) => {
			resolve(output);
		});
	});
};

async function getmetrics(keyword) {
	try {
		const output = await main(keyword);
		return JSON.parse(output);
	} catch (error) {
		console.error(error);
	}
}

module.exports = {
	getmetrics,
};
