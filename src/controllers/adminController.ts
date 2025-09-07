// Admin controller for user role management
import { Request, Response } from 'express';
import { 
  findUserById, 
  updateUserRole, 
  getUsersByRole, 
  getAllUsers 
} from '../models/userModel';
import { DBUser } from '../types';

// Get all users (admin only)
export async function getAllUsersController(req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    
    // Remove sensitive information
    const safeUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      username: user.username,
      display_name: user.display_name,
      role: user.role,
      status: user.status,
      profile_image: user.profile_image,
      last_login_at: user.last_login_at,
      created_at: user.created_at,
      updated_at: user.updated_at
    }));

    res.json({ users: safeUsers });
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
}

// Get users by role (admin/supervisor)
export async function getUsersByRoleController(req: Request, res: Response) {
  try {
    const { role } = req.params;
    
    if (!role || !['user', 'admin', 'supervisor'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const users = await getUsersByRole(role as 'user' | 'admin' | 'supervisor');
    
    // Remove sensitive information
    const safeUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      username: user.username,
      display_name: user.display_name,
      role: user.role,
      status: user.status,
      profile_image: user.profile_image,
      last_login_at: user.last_login_at,
      created_at: user.created_at,
      updated_at: user.updated_at
    }));

    res.json({ users: safeUsers, role });
  } catch (error) {
    console.error('Error getting users by role:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
}

// Update user role (admin only)
export async function updateUserRoleController(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!role || !['user', 'admin', 'supervisor'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be user, admin, or supervisor' });
    }

    // Check if user exists
    const existingUser = await findUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent self-demotion for admins
    if (req.user?.sub === userId && req.user?.role === 'admin' && role !== 'admin') {
      return res.status(400).json({ error: 'Cannot change your own admin role' });
    }

    const updatedUser = await updateUserRole(userId, role);
    if (!updatedUser) {
      return res.status(500).json({ error: 'Failed to update user role' });
    }

    // Return safe user data
    const safeUser = {
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
      display_name: updatedUser.display_name,
      role: updatedUser.role,
      status: updatedUser.status,
      profile_image: updatedUser.profile_image,
      updated_at: updatedUser.updated_at
    };

    res.json({ 
      message: 'User role updated successfully',
      user: safeUser 
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
}

// Get current user's role and permissions
export async function getCurrentUserRoleController(req: Request, res: Response) {
  try {
    if (!req.user?.sub) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await findUserById(req.user.sub);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const permissions = {
      canManageUsers: user.role === 'admin',
      canManageContent: ['admin', 'supervisor'].includes(user.role),
      canViewReports: ['admin', 'supervisor'].includes(user.role),
      canModerateContent: ['admin', 'supervisor'].includes(user.role)
    };

    res.json({
      role: user.role,
      permissions,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        display_name: user.display_name
      }
    });
  } catch (error) {
    console.error('Error getting user role:', error);
    res.status(500).json({ error: 'Failed to get user role' });
  }
}
