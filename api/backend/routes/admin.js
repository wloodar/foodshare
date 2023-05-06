const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/admin');

router.get('/users/all', AdminController.users_getAll);

module.exports = router;