// const contacts = require("../models/contacts");
const { HttpError } = require("../helpers");
const { Contact } = require("../models/contacts");


const { ctrlWrapper } = require("../utils");

// const getAllContacts = async (req, res) => {
//   const { _id: owner } = req.user;
//   const { page = 1, limit = 20, favorite } = req.query;
//   const skip = (page - 1) * limit;
//   const query = { owner };
//   console.log(query, "owner")
//   if (favorite) {
//     query.favorite = favorite;
//     console.log(query, "owner.favorite");
//   }
//   const result = await Contact.find(query, "", {
//     skip,
//     limit,
//   }).populate("owner", "email");
//   res.json(result);
// };

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
   const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  
  
 
  const { favorite } = req.query;
    if (favorite) {
    const result = await Contact.find(
      { owner, favorite },

      
      "-createdAt -updatedAt",
      {
        skip,
        limit,
      }
    ).populate("owner", "email subscription");
    return res.json(result);
  }

  const result = await Contact.find(
    { owner},
    "-createdAt -updatedAt",
    {
      skip,
      limit,
    }
  ).populate("owner", "email subscription ");
  res.json(result);
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
  
  const { _id: owner } = req.user;
  const { email } = req.body;
  
  const contact = await Contact.findOne({ email });
 
   if (contact) {
     throw HttpError(409, "Email in use");
   }
 

  const result = await Contact.create({ ...req.body, owner });

  res.status(201).json(result);
};

const deleteContacts = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, `Contact ${id} is not found`);
  }
  res.status(200).json({ message: "contact deleted" });
};

const updateContacts = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, `Contact ${id} is not found`);
  }
  res.status(200).json(result);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, ` "message": "Not found"`);
  }
  res.status(200).json(result);
};

module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactsById: ctrlWrapper(getContactsById),
  addContact: ctrlWrapper(addContact),
  deleteContacts: ctrlWrapper(deleteContacts),
  updateContacts: ctrlWrapper(updateContacts),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
