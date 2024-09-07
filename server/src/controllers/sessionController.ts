// controllers/sessionController.ts

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Session from '../models/Session';
import Availability from '../models/Availability';
import { sendSessionNotification } from '../services/emailService';

export const createSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const { availabilityId, type, attendees } = req.body;

    const availability = await Availability.findById(availabilityId);
    if (!availability) {
      return res.status(404).json({ error: 'Availability not found' });
    }

    if (availability.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to create a session for this availability' });
    }

    const session = new Session({
      user: req.user._id,
      start: availability.start,
      end: availability.end,
      type,
      attendees,
    });

    await session.save();

    availability.scheduledSlots.push({
      start: session.start,
      end: session.end,
      attendees: session.attendees,
    });

    await availability.save();

    await sendSessionNotification(session);

    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: 'Error creating session' });
  }
};

export const getUserSessions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const sessions = await Session.find({ user: req.user._id });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user sessions' });
  }
};

export const getSessionById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching session' });
  }
};

export const updateSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const updates = Object.keys(req.body);
    const allowedUpdates = ['type', 'attendees'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    updates.forEach((update) => {
      (session as any)[update] = req.body[update];
    });

    await session.save();

    await sendSessionNotification(session, 'update');

    res.json(session);
  } catch (error) {
    res.status(400).json({ error: 'Error updating session' });
  }
};

export const deleteSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const session = await Session.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    await Availability.findOneAndUpdate(
      { user: req.user._id, 'scheduledSlots.start': session.start, 'scheduledSlots.end': session.end },
      { $pull: { scheduledSlots: { start: session.start, end: session.end } } }
    );

    await sendSessionNotification(session, 'cancel');

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting session' });
  }
};

export const getAllSessions = async (req: AuthRequest, res: Response) => {
  try {
    const sessions = await Session.find({}).populate('user', 'email');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching all sessions' });
  }
};