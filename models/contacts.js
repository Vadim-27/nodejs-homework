const fs = require('fs/promises');
const { nanoid } = require("nanoid");
const path = require("path");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
}

const getContactById = async (id) => {
  try {
    const contacts = await listContacts();

    const result = contacts.find((item) => item.id === id);

    return result || null;
  } catch (error) {
    console.log(error);
  }
}

const removeContact = async (id) => {
  try {
    const allContacts = await listContacts();
    const index = allContacts.findIndex((item) => item.id === id);
    if (index === -1) {
      return null;
    }
    const [result] = allContacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
    return result;
  } catch (error) {
    console.log(error);
  }
}

const addContact = async ({ name, email, phone }) => {
  try {
    const allContacts = await listContacts();
    const newContact = {
      id: nanoid(),
      name,
      email,
      phone,
    };
    allContacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
   
    return newContact;
  } catch (error) {
    console.log(error);
  }
};

const updateContact = async (id, data ) => {
  try {
    const allContacts = await listContacts();
    const index = allContacts.findIndex(item => item.id === id);
    allContacts[index] = { id, ...data };
    await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
    return allContacts[index];


  }catch(error){console.log(error)}
  
  

}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
