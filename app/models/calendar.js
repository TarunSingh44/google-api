const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;

const CalendarSchema = new mongoose.Schema({
  industry: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
  keywords: {
    type: [{
        type: String
    }],
    default: [],
  },
  campaigns: {
    type: [{
        type: String
    }],
    default: [],
  },
  selectedDates: {
    type: [{
        type: Date
    }],
    default: [],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});
CalendarSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Calendar', CalendarSchema);
