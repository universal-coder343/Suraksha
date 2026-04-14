const Contact = require('../models/Contact');

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.user._id });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addContact = async (req, res) => {
  try {
    const count = await Contact.countDocuments({ userId: req.user._id });
    if (count >= 5) {
      return res.status(400).json({ message: 'Maximum 5 contacts allowed' });
    }

    const { name, phone, relationship } = req.body;
    const contact = await Contact.create({
      userId: req.user._id,
      name,
      phone,
      relationship
    });

    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    if (contact.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    contact.name = req.body.name || contact.name;
    contact.phone = req.body.phone || contact.phone;
    contact.relationship = req.body.relationship || contact.relationship;
    
    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    if (contact.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    await contact.deleteOne();
    res.json({ message: 'Contact removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getContacts,
  addContact,
  updateContact,
  deleteContact
};
