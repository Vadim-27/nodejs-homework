const express = require('express')

const router = express.Router()
const Joi =require('joi')
const contacts = require("../../models/contacts");
const { HttpError } = require("../../helpers");
// const { string } = require('joi');

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});



router.get('/', async (req, res, next) => {
  try {
    const allContacts = await contacts.listContacts();
    res.json(allContacts);
  } catch (error) {
    next(error)
  }
  
})

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contacts.getContactById(id);
    if (!result) {
      throw HttpError(404, `Contact with ${id} not found`);
    }
    
    res.json(result);
  } catch (error) {
    next(error)
  }
  
})

router.post('/', async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = contacts.addContact(req.body);

    res.status(201).json(result);
  } catch (error) {
    next(error)
  }
  
})

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contacts.removeContact(id);
    if (!result) {
      throw HttpError(404, `Contact ${id} is not found`)
    }
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error)
  }
  
})

router.put('/:id', async (req, res, next) => {
  try {
    
    const { error } = addSchema.validate(req.body)
    if (error) {
      throw HttpError(400, error.message);
    }
    const { id } = req.params;
    const result = await contacts.updateContact(id, req.body);
    if (!result) {
      throw HttpError(404, `Contact ${id} is not found`);
    }
    res.status(200).json(result);
  } catch (error) {
    next(error)
  }
  
})

module.exports = router
