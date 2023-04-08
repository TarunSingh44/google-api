const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { Schema } = mongoose;

const CompanySchema = new mongoose.Schema({
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	name: {
		type: String,
		required: true
	},
	members: [
		{
			// userId: {
			// 	type: String
			// },
			// userFirstName: {
			// 	type: String
			// },
			// userLastName: {
			// 	type: String
			// },
			// userEmail: {
			// 	type: String
			// },
			// userSquareId: {
			// 	type: String
			// },
			// userSquareSubscriptionId: {
			// 	type: String
			// },
			// dateJoined: {
			// 	type: String
			// },
			// companyRole: {
			// 	type: String,
			// 	enum: ["team", "admin"],
			// 	default: "team"
			// },
			// personalCard: {
			// 	type: Boolean,
			// 	default: false
			// },
			// avatar: {
			// 	custom: {
			// 		type: Boolean,
			// 		default: false
			// 	},
			// 	color: {
			// 		type: String,
			// 		default: "#bdbdbd"
			// 	}
			// }
			companyName: {
			 	type: String
			},
			companyType: {
				type: String
			},
			incorporationDate: {
				type:  mongoose.Schema.Types.Date
			},
			countryOfOrigin: {
				type: String
		   },
		   currency: {
			type: String
	  	   },

		}
	],
	sections: [
		{
			createdBy: {
				type: String //  id of user
			},
			sectionType: {
				type: String
			},
			lastUpdated: {
				type: Date,
				default: Date.now
			},
			title: {
				type: String
			},
			sheetContent: {
				type: Object
			}
		}
	],
	subscription: {
		active: {
			type: Boolean
		},
		purchaseDate: {
			type: Date
		}
	}
});
CompanySchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Company", CompanySchema);