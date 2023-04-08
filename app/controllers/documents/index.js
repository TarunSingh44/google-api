const { validateCreateDocumentRequestBody, validateUpdateDocumentRequestBody } = require('./validator');
const DocumentModel = require('../../models/document');
const { sendApiSuccessResponse, sendApiErrorResponse } = require('../../utils/response.utils');
const { isValidObjectId } = require('../../utils/mongoose.utils');

async function createNewDocument(req, res) {
  try {
    const { user } = req;
    const document = new DocumentModel({
      ...req.body,
      createdBy: user.id,
    });
    await document.save();
    sendApiSuccessResponse(res, document, 'You have successfully created a new document');
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}
createNewDocument.validate = validateCreateDocumentRequestBody;

async function getAllDocuments(req, res) {
  // TODO: Add pagination to find queries
  try {
    let documents = [];
    const { user } = req;

    if (req.companyId) {
      documents = await DocumentModel.find({ companyId: req.companyId });
    } else {
      documents = await DocumentModel.find({ createdBy: user.id });
    }

    sendApiSuccessResponse(res, documents, 'Successfully retrieved documents');
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}

async function getSingleDocument(req, res) {
  try {
    const { user, params } = req;
    let documentScopeQuery = { createdBy: user.id };

    if (!isValidObjectId(params.id)) {
      throw new Error('Invalid value of id in request param');
    }

    if (req.companyId) {
      documentScopeQuery = { companyId: req.companyId };
    }

    const document = await DocumentModel.findOne({
      ...{ documentScopeQuery },
      _id: params.id,
    });

    if (!document) {
      throw new Error('You cannot view this document because it has been deleted by the creator');
    }

    sendApiSuccessResponse(res, document, 'Successfully retrieved document data');
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}

async function updateSingleDocument(req, res) {
  try {
    const { user, params, body } = req;
    const documentId = params.id;
    let documentScopeQuery = {};

    if (!isValidObjectId(params.id)) {
      throw new Error('Invalid value of id in request param');
    }

    if (req.companyId) {
      documentScopeQuery = { companyId: req.companyId };
    }

    const document = await DocumentModel.findOneAndUpdate({
      ...documentScopeQuery,
      createdBy: user.id,
      _id: documentId,
    }, { title: body.title, spreadsheetData: body.spreadsheetData }, {
      new: true,
    });
    sendApiSuccessResponse(res, document, 'You have successfully updated this document');
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}
updateSingleDocument.validate = validateUpdateDocumentRequestBody;

async function deleteSingleDocument(req, res) {
  try {
    const documentId = req.params.id;
    let documentScopeQuery = {};

    if (!isValidObjectId(documentId)) {
      throw new Error('Invalid value of id in request param');
    }

    if (req.companyId) {
      documentScopeQuery = { companyId: req.companyId };
    }

    const document = await DocumentModel.findOneAndDelete({
      ...documentScopeQuery,
      createdBy: req.user.id,
      _id: documentId,
    });

    if (!document) {
      throw new Error('This document has already been deleted');
    }

    sendApiSuccessResponse(res, null, `Successfully deleted document with title ${document.title}`);
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}

module.exports = {
  createNewDocument, getAllDocuments, getSingleDocument, deleteSingleDocument, updateSingleDocument,
};
