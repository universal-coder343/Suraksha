const express = require('express');
const router = express.Router();
const {
  getContacts,
  addContact,
  updateContact,
  deleteContact
} = require('../controllers/contactsController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getContacts)
  .post(protect, addContact);

router.route('/:id')
  .put(protect, updateContact)
  .delete(protect, deleteContact);

module.exports = router;
