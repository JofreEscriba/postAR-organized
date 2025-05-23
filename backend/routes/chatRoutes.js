import express from 'express';
import {
  getAllChats,
  getChatById,
  getChatsByUser,
  createChat,
  confirmChat,
  setChatInvisible,
  deleteChat
} from '../controllers/chatController.js';

const router = express.Router();

// Definir las rutas
router.get('/', getAllChats);
router.get('/user/', getChatsByUser);
router.get('/:idChat', getChatById);
router.post('/', createChat);
router.put('/confirm/:idChat', confirmChat);
router.put('/invisible/:idChat', setChatInvisible);
router.delete('/:idChat', deleteChat);

// Exportar usando export default
export default router;
