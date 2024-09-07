// controllers/userController.ts

import { Response } from 'express';
import User, { IUser } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.params.id;

    // Check if the userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    // Find the user by ID
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the authenticated user is trying to access their own information or if they're an admin
    if (req.user._id.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied. You can only view your own profile or you need admin rights.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error in getUserById:', error);
    res.status(500).json({ error: 'An unexpected error occurred while fetching the user' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['email', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Only allow the admin to update users
    if (!req.user?.isAdmin) {
      return res.status(403).json({ error: 'Admin rights required to update this user' });
    }

    updates.forEach((update) => {
      if (update === 'password') {
        user.password = bcrypt.hashSync(req.body.password, 10);
      } else {
        (user as any)[update] = req.body[update];
      }
    });

    await user.save();
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error updating user' });
  }
};


export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    // Only allow the admin to delete users
    if (!req.user?.isAdmin) {
      return res.status(403).json({ error: 'Admin rights required to delete this user' });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};
