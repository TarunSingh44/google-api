const marketingRouter = require('express').Router();
const marketingController = require('../controllers/marketing');
// const { authenticationMiddleWare } = require('../middleware/auth');

// marketingRouter.use(authenticationMiddleWare); 

marketingRouter.post(
  '/',
  marketingController.createNewMarketingUser
);

marketingRouter.get(
  '/',
  marketingController.GetMarketingUsers
);

module.exports = marketingRouter;