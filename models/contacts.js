const fs = require("fs/promises");

const listContacts = async () => {
  const contacts = await fs.readFile("models/contacts.json", "utf-8");
  return contacts;
};

const getContactById = async (contactId) => {
  const contacts = JSON.parse(
    await fs.readFile("models/contacts.json", "utf-8")
  );
  const contact = contacts.find(({ id }) => Number(id) === Number(contactId));
  return contact;
};

const addContact = async (body) => {
  return await fs
    .readFile("models/contacts.json", "utf-8")
    .then((contactsRaw) => {
      const contacts = JSON.parse(contactsRaw);
      const id = String(contacts.length + 1);
      const newContact = {
        id,
        ...body,
      };
      const newContactsList = JSON.stringify([...contacts, newContact]);

      fs.writeFile("models/contacts.json", newContactsList);

      return newContact;
    });
};

const removeContact = async (contactId) => {
  const contacts = JSON.parse(
    await fs.readFile("models/contacts.json", "utf-8")
  );
  const isContactExist = contacts.find(
    ({ id }) => Number(id) === Number(contactId)
  );

  // If there's no contact with such ID - return undefined
  if (!isContactExist) {
    return isContactExist;
  }

  const newContactsList = contacts.filter(
    ({ id }) => Number(id) !== Number(contactId)
  );

  fs.writeFile("models/contacts.json", JSON.stringify(newContactsList));

  return isContactExist;
};

const updateContact = async (contactId, body) => {
  const contacts = JSON.parse(
    await fs.readFile("models/contacts.json", "utf-8")
  );
  const contactToChange = contacts.find(
    ({ id }) => Number(id) === Number(contactId)
  );

  // If there's no contact with such ID - return false to catch it in contacts router.
  if (!contactToChange) {
    return false;
  }

  // If in body.name we receive a data - update contact, otherwise remain prev value.
  const updatedContact = {
    id: contactToChange.id,
    name: body.name ? body.name : contactToChange.name,
    email: body.email ? body.email : contactToChange.email,
    phone: body.phone ? body.phone : contactToChange.phone,
  };

  const newContactsList = [
    ...contacts.filter(({ id }) => id !== contactId),
    updatedContact,
  ];

  fs.writeFile("models/contacts.json", JSON.stringify(newContactsList));

  return updatedContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
