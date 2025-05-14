const express = require('express');
const router = express.Router();
const postcardController = require('../controllers/postcardController');

router.get('/', postcardController.getAllPostcards);
router.get('/:id', postcardController.getPostcardById);
router.post('/', postcardController.createPostcard);
router.put('/:id', postcardController.updatePostcard);
router.delete('/:id', postcardController.deletePostcard);

module.exports = router;
