const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/chats/all', chatController.getAllChats);
router.get('/chats/:idChat', chatController.getChatById);
router.get('/chats', chatController.getChatsByUser);
router.post('/chats', chatController.createChat);
router.put('/chats/confirm/:idChat', chatController.confirmChat);
router.put('/chats/visible/:idChat', chatController.setChatInvisible);
router.delete('/chats/:idChat', chatController.deleteChat);

module.exports = router;
