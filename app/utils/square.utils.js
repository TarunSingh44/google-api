const { Client, Environment } = require('square');
const crypto = require('crypto');
const environment = require('../../config/environment');

const client = new Client({
  accessToken: environment.SQUARE_ACCESS_TOKEN,
  environment: environment.NODE_ENV !== 'production' ? Environment.Sandbox : Environment.Production,
});

module.exports = client;
