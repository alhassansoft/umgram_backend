// Admin routes for user role management
import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requireAdmin, requireSupervisorOrAdmin } from '../middleware/roleAuth';
import {
  getAllUsersController,
  getUsersByRoleController, 
  updateUserRoleController,
  getCurrentUserRoleController
} from '../controllers/adminController';

const router = Router();

// Get current user's role and permissions (authenticated users)
router.get('/api/admin/me/role', requireAuth, getCurrentUserRoleController);

// Get all users (admin only)
router.get('/api/admin/users', requireAuth, requireAdmin, getAllUsersController);

// Get users by role (admin/supervisor)
router.get('/api/admin/users/role/:role', requireAuth, requireSupervisorOrAdmin, getUsersByRoleController);

// Update user role (admin only)
router.put('/api/admin/users/:userId/role', requireAuth, requireAdmin, updateUserRoleController);

export default router;
