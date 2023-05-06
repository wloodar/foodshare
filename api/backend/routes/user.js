const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')

const UserController = require('../controllers/user');

router.get('/current/general', checkAuth, UserController.get_currentuser_genereal_info);

router.post('/current/school/update', checkAuth, UserController.school_update);

router.get('/current/offers-received', checkAuth, UserController.get_user_received_offers);

router.post('/current/credentials/update', checkAuth, UserController.updateUserCredentials);

module.exports = router;