import express from 'express';
import {
  getAllPostcards,
  getPostcardById,
  createPostcard,
  updatePostcard,
  deletePostcard
} from '../controllers/postcardController.js';

const router = express.Router();

router.get('/', getAllPostcards);
router.get('/:id', getPostcardById);
router.post('/', createPostcard);
router.put('/:id', updatePostcard);
router.delete('/:id', deletePostcard);

export default router;
