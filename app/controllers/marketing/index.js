const { sendApiSuccessResponse, sendApiErrorResponse } = require('../../utils/response.utils');
const environment = require('../../../config/environment');
const MarketingModel = require('../../models/marketing');
const fs = require('fs');
const AWS = require("aws-sdk");
AWS.config.update({ region: "us-west-2" });
const path = require('path');


async function createNewMarketingUser(req, res) {
  try {
    const { body } = req;
    const newuser = await new MarketingModel({
      firstName: body.firstname,
      lastName: body.lastname,
      company: body.company,
      industry: body.industry,
      email: body.email,
      createdBy: body.email,
    }).save();

    SendMarketingEmail(body.email);

    sendApiSuccessResponse(res, newuser, 'You have successfully created a new marketing user');

  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}

async function GetMarketingUsers() {
  //implement query here
  const users = new MarketingModel({
  });
}

// this function needs to work on a variety of environments
// could be lo or lo0 


function SendMarketingEmail(userEmail) {
  const apiurl = `${environment.API_URL}`;
  // Read the HTML file
  const filePath = path.join(__dirname, 'marketingmessage.html');
  let html = fs.readFileSync(filePath, 'utf8');  
  html = html.replace(/{{apiurl}}/g, apiurl);
  const params = {
    Destination: {
      ToAddresses: [userEmail],
    },
    Message: {
      Body: {
        Html: {
          Data: html,
        },
      },
      Subject: {
        Data: "Here is the link to access the definitive guide to achieving Product Market Fit in a startup",
      },
    },
    Source: `info@ondecentral.com`,
  };
  var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
    .sendEmail(params)
    .promise();
  return sendPromise;
}

module.exports = {
  createNewMarketingUser,
  GetMarketingUsers,
};

