import express from 'express';
import { loginUser, signupUser, getOAuthUrl, forgotPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/signin', loginUser);
router.post('/signup', signupUser);
router.get('/oauth-url', getOAuthUrl);
router.post('/forgot-password', forgotPassword);


export default router;
