import express from 'express';
import {
  submitContactMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage,
} from '../controllers/contactController.js';
import { protect, requireAdmin } from '../middleware/auth.js';
import { contactValidation, handleValidation } from '../middleware/validators.js';
import { contactLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

router.post('/', contactLimiter, contactValidation, handleValidation, submitContactMessage);
router.get('/', protect, requireAdmin, getMessages);
router.patch('/:id', protect, requireAdmin, updateMessageStatus);
router.delete('/:id', protect, requireAdmin, deleteMessage);

export default router;
