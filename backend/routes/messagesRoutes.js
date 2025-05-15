import express from 'express';
import {
  getMessages,
  createMessage,
  deleteMessagesIfHidden,
  deleteUserMessages,
  hideUserMessages
} from '../controllers/messagesController.js';

const router = express.Router();

router.get('/', getMessages);
router.post('/', createMessage);
router.delete('/hidden', deleteMessagesIfHidden);
router.delete('/user', deleteUserMessages);
router.put('/hide', hideUserMessages);

export default router;
