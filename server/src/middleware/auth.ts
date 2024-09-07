import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    console.log('Auth middleware started');
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ error: 'Authentication token is missing.' });
    }

    console.log('Token received:', token);

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    } catch (jwtError) {
      console.log('JWT verification failed:', jwtError);
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    console.log('Token decoded:', decoded);

    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      console.log('User not found for id:', decoded.userId);
      return res.status(401).json({ error: 'User not found. Please log in again.' });
    }

    console.log('User found:', user.email);
    req.user = user;
    next();
  } catch (error) {
    console.error('Unexpected error in auth middleware:', error);
    res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
  }
};

export const adminAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    console.log('Admin auth middleware started');
    await auth(req, res, (err) => {
      if (err) {
        return;
      }
      
      if (!req.user?.isAdmin) {
        console.log('Non-admin user attempted to access admin route:', req.user?.email);
        return res.status(403).json({ error: 'Access denied. Admin rights required.' });
      }
      
      console.log('Admin access granted for user:', req.user.email);
      next();
    });
  } catch (error) {
    console.error('Unexpected error in admin auth middleware:', error);
    res.status(500).json({ error: 'An unexpected server error occurred. Please try again later.' });
  }
};