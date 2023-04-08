const mongoose = require('mongoose');
const path = require('path');
const loadModels = require('../app/models');
const environment = require('./environment');

async function createMongoConnection() {
  console.log(path.resolve(__dirname, '../rds-combined-ca-bundle.pem'));
  try {
    await mongoose.connect(environment.DATABASE_URL, {
      autoIndex: false,
      // keepAlive: true,
      // useUnifiedTopology: true,
      // useNewUrlParser: true,
      // ssl: true,
      // sslValidate: true,
      // sslCA: path.resolve(__dirname, '../rds-combined-ca-bundle.pem'),
      // // sslCAFile: path.resolve(__dirname, '../rds-combined-ca-bundle.pem'),
      // retryWrites: false,
      // tlsCAFile: 'rds-combined-ca-bundle.pem', // path.resolve(__dirname, '../rds-combined-ca-bundle.pem'),
    });
    console.log('****************************');
    console.log('*    Starting Server');
    console.log(`*    Port: ${process.env.PORT}`);
    console.log(`*    NODE_ENV: ${process.env.NODE_ENV}`);
    console.log('*    Database: MongoDB');
    console.log('*    DB Connection: OK\n****************************\n');
  } catch (error) {
    console.log(error);
    console.log('****************************');
    console.log(`*    Error connecting to DB: ${error.message}\n****************************\n`);
    // TODO: Emit error to company emails
    process.exit(-1);
  }
}

function mongooseConnectionErrorListener(error) {
  console.log(error);
  // TODO: Emit error to company emails
  process.exit(-1);
}

mongoose.connection.on('error', mongooseConnectionErrorListener);
// mongoose.connection.on('disconnected', createMongoConnection);

module.exports = async () => {
  await createMongoConnection();
  loadModels();
};
