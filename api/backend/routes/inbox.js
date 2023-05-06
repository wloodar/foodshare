const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')

const InboxController = require('../controllers/inbox');

router.get('/fetch-inbox', checkAuth, InboxController.getInbox);

router.get('/fetch-conversation', checkAuth, InboxController.getConversation);

router.get('/get-messages', checkAuth, InboxController.getMessages);

router.post('/create-conversation', checkAuth, InboxController.createConversation);

module.exports = router;