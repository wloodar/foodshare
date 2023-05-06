const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')

const AuthController = require('../controllers/auths');

router.post('/login', AuthController.auth_login);

router.post('/signup', AuthController.auth_register);

router.post('/password/reset', AuthController.auth_password_reset);

router.post('/password/reset/validate-token', AuthController.auth_password_reset_validate_token);

router.post('/password/reset/change', AuthController.auth_password_reset_change_password);

router.get('/upload-auth', checkAuth, AuthController.uploadAuth);

router.get('/test', AuthController.getSchoolDetails);

module.exports = router;