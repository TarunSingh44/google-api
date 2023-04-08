/* eslint-disable no-prototype-builtins */
const yup = require('yup');
const { sendApiErrorResponse } = require('../../../../utils/response.utils');
const { subscriptionFrequencies, subscriptionPlansTypes } = require('../../../../utils/subscriptions.utils');

exports.validateCreateSubscriptionPlanRequestBody = async function (req, res, next) {
  try {
    const schema = yup.object({
      price: yup.number().required('Missing value of price in request body'),
      name: yup.string().required('Missing value of name in request body'),
      type: yup.string()
        .required('Missing value of type in request body')
        .test('type', 'Invalid value of type in request body', (value) => subscriptionPlansTypes.hasOwnProperty(value)),
      frequency: yup.string()
        .required('Missing value of frequency in request body')
        .test('frequency', 'Invalid value of frequency in request body', (value) => subscriptionFrequencies.hasOwnProperty(value)),
    });
    req.body = await schema.validate(req.body);
    next();
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
};
