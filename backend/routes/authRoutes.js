import express from 'express';
import { loginUser, signupUser, getOAuthUrl } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', signupUser);
router.get('/oauth-url', getOAuthUrl);

export default router;
