const { Schema, model } = require('mongoose');
const Joi = require('joi')

const { handleMongooseError } = require('../utils')
const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const subscriptionTypes = ["starter", "pro", "business"];


const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name must be exist "],
    },
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: [true, "Email must be exist"],
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, "password must be at least 6 characters"],
    },
    subscription: {
      type: String,
      enum: subscriptionTypes,
      default: "starter",
    },
    token: {
      type: String,
      default: "",
    },
    avatarURL: {
      type: String,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: "",
    }
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});
const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionTypes),
});
const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
 
});

const schemas = {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
  emailSchema,
};

const User = model("user", userSchema);

module.exports = {
    User,
    schemas,
}