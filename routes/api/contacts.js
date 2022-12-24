const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  res.set("Content-Type", "application/json").send(contacts);
});

router.get("/:contactId", async (req, res, next) => {
  const id = req.params.contactId;
  const contact = await getContactById(id);

  if (!contact) {
    res.status(404).json({ message: "Not found" }).end();
    return;
  }

  res.json(contact);
});

router.post("/", async (req, res, next) => {
  const newContact = await addContact(req.body);

  res.status(201).json(newContact);
});

router.delete("/:contactId", async (req, res, next) => {
  const id = req.params.contactId;
  const isContactExist = await removeContact(id);

  isContactExist
    ? res.status(200).json({ message: "Contact deleted" })
    : res.status(404).json({ message: "Not found" });
});

router.put("/:contactId", async (req, res, next) => {
  const id = req.params.contactId;
  const contactChanges = req.body;
  const updatedContact = await updateContact(id, contactChanges);

  updatedContact
    ? res.status(200).json(updatedContact)
    : res.status(404).json({ message: "Not found" });
});

module.exports = router;
