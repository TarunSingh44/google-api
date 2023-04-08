const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const { Schema } = mongoose;

const TemplateSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		spreadsheetUrl: {
			type: String,
			default: null,
		},
		spreadsheetData: {
			type: Object,
			default: {
				name: "sheet2",
				freeze: "A1",
				styles: [],
				merges: [],
				rows: { len: 100 },
				cols: { len: 26 },
				validations: [],
				autofilter: {},
			},
		},
		type: {
			type: String,
			enum: ["premium, free"],
			default: "free",
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		published: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);
TemplateSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Template", TemplateSchema);
