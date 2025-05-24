import express from 'express';
import upload from '../middlewares/upload.js';

import {
  getAllPostcards,
  getPostcardById,
  createPostcard,
  updatePostcard,
  deletePostcard,
  getAllPostcardsSent,
  getAllPostcardsReceived,
} from '../controllers/postcardController.js';

const router = express.Router();

router.get('/', getAllPostcards);
router.get('/:id', getPostcardById);
router.post('/', upload.single('media'), createPostcard);
router.put('/:id', updatePostcard);
router.delete('/:id', deletePostcard);
router.get('/sent/:userId', getAllPostcardsSent);
router.get('/received/:userId', getAllPostcardsReceived);


export default router;
