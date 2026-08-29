import express from 'express';
import {
  getTestimonials,
  getAllTestimonialsAdmin,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTestimonials);
router.get('/admin/all', protect, requireAdmin, getAllTestimonialsAdmin);
router.post('/', protect, requireAdmin, createTestimonial);
router.put('/:id', protect, requireAdmin, updateTestimonial);
router.delete('/:id', protect, requireAdmin, deleteTestimonial);

export default router;
