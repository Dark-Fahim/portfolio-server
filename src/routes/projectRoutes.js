import express from 'express';
import {
  getProjects,
  getProjectBySlug,
  getAllProjectsAdmin,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { protect, requireAdmin } from '../middleware/auth.js';
import { projectValidation, handleValidation } from '../middleware/validators.js';

const router = express.Router();

// Public
router.get('/', getProjects);

// Admin (must be declared before the public ':slug' route below)
router.get('/admin/all', protect, requireAdmin, getAllProjectsAdmin);
router.post('/', protect, requireAdmin, projectValidation, handleValidation, createProject);
router.put('/:id', protect, requireAdmin, updateProject);
router.delete('/:id', protect, requireAdmin, deleteProject);

// Public — kept last so 'admin' and other static segments above win first
router.get('/:slug', getProjectBySlug);

export default router;
