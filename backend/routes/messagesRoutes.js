const express = require("express");
const router = express.Router();
const messagesController = require("../controllers/messagesController");

// GET mensajes por idChat y numUsuari
router.get("/", messagesController.getMessages);

// POST nuevo mensaje
router.post("/", messagesController.createMessage);

// DELETE mensajes ocultos por ambos usuarios
router.delete("/", messagesController.deleteMessagesIfHidden);

// DELETE mensajes de un usuario específico
router.delete("/myMessages", messagesController.deleteUserMessages);

// PUT ocultar mensajes de un usuario
router.put("/myMessages", messagesController.hideUserMessages);

module.exports = router;
