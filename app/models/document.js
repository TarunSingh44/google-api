const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;

const DocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  companyId: {
    type: Schema.Types.ObjectId,
    default: null,
    // TODO: Add ref 'Company'
  },
  spreadsheetUrl: {
    type: String,
    default: null,
  },
  spreadsheetData: {
    type: Object,
    default: null,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});
DocumentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Document', DocumentSchema);
