import express from 'express';
import { login, logout, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { loginValidation, handleValidation } from '../middleware/validators.js';
import { authLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

router.post('/login', authLimiter, loginValidation, handleValidation, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;
