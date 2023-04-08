const { spawn } = require("child_process");
require("dotenv").config();

const customerIds = process.env.CUSTOMER_IDS;
const campaign = spawn("python", ["Campaign.py", customerIds]);

campaign.stdout.on("data", (data) => {
	console.log(`Output: ${data}`);
});

campaign.stderr.on("data", (data) => {
	console.log(`Error: ${data}`);
});
