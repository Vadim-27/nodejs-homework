const { Schema, model } = require("mongoose");
const Joi = require("joi");

const {handleMongooseError} = require('../utils');

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name must be exist "],
  },
  email: {
    type: String,
    required: [true, "Email must be exist"],
  },
  phone: {
    type: String,
    required: [true, "Phone must be exist"],
  },
  favorite: {
    type: Boolean,
    default: false,
  },
}, {versionKey: false, timestamps: true});

contactSchema.post("save", handleMongooseError);

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

const updateSchema = Joi.object({
  favorite: Joi.boolean().required(),
})
const schemas = {
  addSchema,
  updateSchema,
};

const Contact = model("contact", contactSchema);
module.exports = {
  Contact,
  schemas,
};

