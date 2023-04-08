const mongoose = require('mongoose');

const CompanyMemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
  role: {
    type: String,
    enums: ['member', 'administrator'],
  },

  squareSubscriptionId: {
    type: String,
    default: null,
  },

  squareCardId: {
    type: String,
    default: null,
  },

  payments: {
    type: [{
      squareSubscriptionId: String,
      squareInvoiceId: String,
      createdAt: mongoose.Schema.Types.Date,
      expiresAt: mongoose.Schema.Types.Date,
    }],
    default: () => [],
  },
});

module.exports = mongoose.model('Company Member', CompanyMemberSchema);
