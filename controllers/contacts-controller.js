// const contacts = require("../models/contacts");
const { HttpError } = require("../helpers");
const {Contact} = require('../models/contacts')


const {ctrlWrapper}= require ('../utils')


 

const getAllContacts = async (req, res) => {
   
     const allContacts = await Contact.find({});
     res.json(allContacts);

};
 
const getContactsById = async (req, res) => {
  
    const { id } = req.params;
    const result = await Contact.findById(id);
    if (!result) {
      throw HttpError(404, `Contact with ${id} not found`);
    }

    res.json(result);
 
};

const addContact = async (req, res) => {
  
  
    const result = await Contact.create(req.body);

    res.status(201).json(result);

};

const deleteContacts = async (req, res, next) => {
  
    const { id } = req.params;
    const result = await Contact.findByIdAndDelete(id);
    if (!result) {
      throw HttpError(404, `Contact ${id} is not found`);
    }
    res.status(200).json({ message: "contact deleted" });

};

const updateContacts = async (req, res) => {
  
    
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
    if (!result) {
      throw HttpError(404, `Contact ${id} is not found`);
    }
    res.status(200).json(result);
 
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404,` "message": "Not found"`)
  }
res.status(200).json(result)
}

module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
    getContactsById: ctrlWrapper(getContactsById),
    addContact: ctrlWrapper(addContact),
    deleteContacts: ctrlWrapper(deleteContacts),
  updateContacts: ctrlWrapper(updateContacts),
    updateStatusContact: ctrlWrapper(updateStatusContact),
}

