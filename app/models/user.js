const bcrypt = require('bcryptjs');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose = require('mongoose');
const validator = require("validator");
const jwt = require('jsonwebtoken');
const environment = require('../../config/environment');
const { createEncryption } = require('../utils/encryption.utils');
const SubscriptionModel = require('./subscription');

const UserSchema = new mongoose.Schema(
	{
		firstName: {
			type: String
		},
		lastName: {
			type: String
		},
		email: {
			type: String,
			validate: {
				validator: validator.isEmail,
				message: "EMAIL_IS_NOT_VALID"
			},
			lowercase: true,
			unique: true,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user"
		},
		company: {
			dateJoined: {
				type: String
			},
			companyName: {
				type: String
			},
			companyId: {
				type: String
			},
			companyRole: {
				type: String,
				enum: ["team", "admin"]
			},
			personalCard: {
				type: Boolean,
				default: false
			}
		},
		squareOrders: [
			{
				orderId: {
					type: String
				}
			}
		],
		subscription: {
			// createdAt and endDate are used to track free-trials. Square handles pro status
			name: {
				type: String // 7-day-free-trial, pro-monthly, pro-yearly, pro-teammember
			},
			squareId: {
				type: String,
				default: ""
			},
			squareSubscriptionId: {
				type: String,
				default: ""
			},
			status: {
				type: Boolean
			},
			cancellationDate: {
				type: String
			},
			createdAt: {
				type: String
			},
			trialEndDate: {
				type: String
			},
			renewalDate: {
				type: String
			}
		},
		avatar: {
			custom: {
				type: Boolean,
				default: false
			},
			color: {
				type: String,
				default: "#bdbdbd"
			}
		},
		verification: {
			type: String
		},
		verified: {
			type: Boolean,
			default: false
		},
		customerId: {
			type: String
		},
		phone: {
			type: String
		},
		city: {
			type: String
		},
		country: {
			type: String
		},
		urlTwitter: {
			type: String,
			validate: {
				validator(v) {
					return v === "" ? true : validator.isURL(v);
				},
				message: "NOT_A_VALID_URL"
			},
			lowercase: true
		},
		urlGitHub: {
			type: String,
			validate: {
				validator(v) {
					return v === "" ? true : validator.isURL(v);
				},
				message: "NOT_A_VALID_URL"
			},
			lowercase: true
		},
		loginAttempts: {
			type: Number,
			default: 0,
			select: false
		},
		blockExpires: {
			type: Date,
			default: Date.now,
			select: false
		}
	},
	{
		versionKey: false,
		timestamps: true
	}
);

/*
* This function hashes the user's password before storing it
* */
UserSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

/*
* These are helper functions attached to the model. They can only be
* used when an instance of the model has been created
* */
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.getPublicUserData = async function () {
  const subscription = await SubscriptionModel.findByUserId(this.id);
  const user = this.toJSON();
  delete user.password;
  if (subscription) {
    user.subscription = subscription;
    user.subscription.isActive = subscription.payments.length > 0 ? new Date(
      subscription.payments[subscription.payments.length - 1].expiresAt,
    ).getTime() > Date.now() : false;
  }
  return user;
};

UserSchema.methods.createAccessToken = function () {
  let expiresIn = parseFloat(environment.JWT_EXPIRATION_IN_MINUTES);
  if (Number.isNaN(expiresIn)) expiresIn = 0;
  expiresIn *= 60000;

  return createEncryption(jwt.sign(
    { _id: this.id },
    environment.JWT_SECRET,
    { expiresIn },
  ));
};

/*
* These are helper functions attached to the model. They can be
* used without creating an instance of the model.`
* */
UserSchema.statics.findByEmailAddress = function (email) {
  return this.findOne({ email });
};

UserSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('User', UserSchema);
