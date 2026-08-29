import express from 'express';
import { getSettings, updateSettings, getDashboardStats } from '../controllers/settingsController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', protect, requireAdmin, updateSettings);
router.get('/dashboard-stats', protect, requireAdmin, getDashboardStats);

export default router;
