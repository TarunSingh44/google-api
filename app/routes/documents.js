const documentsRouter = require('express').Router();
const documentsController = require('../controllers/documents');
const { authenticationMiddleWare, companyAuthenticationMiddleware } = require('../middleware/auth');

documentsRouter.use(authenticationMiddleWare, companyAuthenticationMiddleware);
documentsRouter.get('/', documentsController.getAllDocuments);
documentsRouter.post('/', documentsController.createNewDocument.validate, documentsController.createNewDocument);
documentsRouter.get('/:id', documentsController.getSingleDocument);
documentsRouter.post('/:id', documentsController.updateSingleDocument.validate, documentsController.updateSingleDocument);
documentsRouter.delete('/:id', documentsController.deleteSingleDocument);

module.exports = documentsRouter;
