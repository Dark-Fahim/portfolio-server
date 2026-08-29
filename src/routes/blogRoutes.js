import express from 'express';
import {
  getPosts,
  getPostBySlug,
  getAllPostsAdmin,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/blogController.js';
import { protect, requireAdmin } from '../middleware/auth.js';
import { blogPostValidation, handleValidation } from '../middleware/validators.js';

const router = express.Router();

// Public
router.get('/', getPosts);

// Admin (declared before ':slug' so it isn't swallowed as a slug value)
router.get('/admin/all', protect, requireAdmin, getAllPostsAdmin);
router.post('/', protect, requireAdmin, blogPostValidation, handleValidation, createPost);
router.put('/:id', protect, requireAdmin, updatePost);
router.delete('/:id', protect, requireAdmin, deletePost);

// Public
router.get('/:slug', getPostBySlug);

export default router;
