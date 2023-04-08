const mongoose = require('mongoose');

const CompanyInviteSchema = new mongoose.Schema({
  inviter: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  email: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  subscriptionPlanId: {
    type: mongoose.Schema.Types.String,
    required: true,
    ref: 'Subscription Plan',
  },
}, { timestamps: { createdAt: true } });

module.exports = mongoose.model('Company Invite', CompanyInviteSchema);
