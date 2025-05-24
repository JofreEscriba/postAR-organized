import express from 'express';
import { uploadMiddleware, uploadProfileImage } from '../controllers/uploadController.js';

const router = express.Router();

router.post("/", uploadMiddleware, uploadProfileImage);

export default router;
