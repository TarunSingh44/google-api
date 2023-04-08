/* eslint-disable no-underscore-dangle */
const { v4: uuid } = require('uuid');
const CompanyModel = require('../../../models/company');
const CompanyInviteModel = require('../../../models/company-invite');
const CompanyMemberModel = require('../../../models/company-member');
const { sendApiErrorResponse, sendApiSuccessResponse } = require('../../../utils/response.utils');
const { validateSendCompanyInviteToEmailAddressRequestBody } = require('./validator');
const UserModel = require('../../../models/user');
const SubscriptionPlanModel = require('../../../models/subscription-plan');
const SubscriptionModel = require('../../../models/subscription');
const { subscriptionPlansTypes } = require('../../../utils/subscriptions.utils');
const squareClient = require('../../../utils/square.utils');
const environment = require('../../../../config/environment');

async function sendCompanyInviteToEmailAddress(req, res) {
  try {
    const { user, body } = req;
    const existingUser = await UserModel.findOne({
      email: body.email,
      'companies._id': req.params.companyId,
    });

    if (existingUser) {
      throw new Error('This user is already a member of this company.');
    }

    const existingInvite = await CompanyInviteModel.findOne({
      email: body.email,
      companyId: req.params.companyId,
    });
    console.log(existingInvite);
    if (existingInvite) {
      throw new Error('An invite to this email has already been sent.');
    }

    const companyMember = await CompanyMemberModel.findOne({
      userId: user.id,
      companyId: req.params.companyId,
      role: 'administrator',
    });

    if (!companyMember) {
      throw new Error('You do not have permission to invite a member or this company does not exist');
    }

    const subscriptionPlan = await SubscriptionPlanModel.findOne({ type: subscriptionPlansTypes.TEAM_MEMBERSHIP });
    if (!subscriptionPlan) {
      throw new Error(`A subscription Plan of type ${subscriptionPlansTypes.TEAM_MEMBERSHIP} does not exist`);
    }

    const companyInvite = await new CompanyInviteModel({
      email: body.email,
      inviter: user.id,
      companyId: req.params.companyId,
      subscriptionPlanId: subscriptionPlan.id,
    }).save();

    sendApiSuccessResponse(
      res,
      companyInvite,
      `You have successfully sent an invite to ${body.email}`,
    );
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}
sendCompanyInviteToEmailAddress.validate = validateSendCompanyInviteToEmailAddressRequestBody;

async function verifyInviteAndAddToCompany(req, res) {
  try {
    const { user, params } = req;

    if (!user.customerId) {
      const customer = await squareClient.customersApi.createCustomer({
        familyName: user.lastName,
        givenName: user.firstName,
        emailAddress: user.email,
        referenceId: user.id,
        idempotencyKey: uuid().toString(),
      });
      await user.update(
        { customerId: customer.result.customer.id },
        { new: true },
      );
      user.customerId = customer.result.customer.id;
    }

    const invite = await CompanyInviteModel.findOne({
      _id: params.inviteId,
      email: user.email,
    }).populate(['inviter', 'companyId', 'subscriptionPlanId']);

    if (!invite) {
      throw new Error('Sorry, you have supplied an invalid invitation code');
    }

    const newMember = await new CompanyMemberModel({
      userId: user.id,
      companyId: invite.companyId._id,
      role: 'member',
    }).save();

    await CompanyModel.findByIdAndUpdate(invite.companyId, {
      $push: {
        members: { _id: newMember.id },
      },
    }, { new: true });

    await user.update({
      $push: {
        companies: { _id: invite.companyId },
      },
    }, { new: true });

    // trigger payment
    try {
      const inviterSubscription = await SubscriptionModel.findByUserId(invite.inviter.id);
      console.log(invite.inviter.id);
      console.log(inviterSubscription);
      const { result: squareSubscription } = await squareClient.subscriptionsApi.createSubscription(
        {
          idempotencyKey: uuid().toString(),
          planId: invite.subscriptionPlanId.ref,
          locationId: environment.SQUARE_LOCATION_ID,
          customerId: invite.inviter.customerId,
          cardId: inviterSubscription.squareCardId,
        },
      );

      await newMember.update({
        squareSubscriptionId: squareSubscription.subscription.id,
        squareCardId: squareSubscription.subscription.cardId,
      }, { new: true });
    } catch (error) {
      console.log(error);
      // Reverse all creation and updates
      // await newMember.deleteOne()
      throw new Error('An error occurred while processing your invitation');
    }

    sendApiSuccessResponse(
      res,
      newMember,
      `You have successfully accepted the invitation to join ${invite.companyId.name}`,
    );
    await invite.deleteOne();
  } catch (error) {
    sendApiErrorResponse(res, error);
  }
}

module.exports = { sendCompanyInviteToEmailAddress, verifyInviteAndAddToCompany };
