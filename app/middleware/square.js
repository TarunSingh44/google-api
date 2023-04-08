const square = require('square')

module.exports = new square.Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: square.Environment.Production
})
