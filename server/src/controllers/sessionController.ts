import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Session from '../models/Session';
import Availability from '../models/Availability';
import { sendSessionNotification } from '../services/emailService';

// Create a new session based on availability
export const createSession = async (req: AuthRequest, res: Response) => {
  try {
    const { availabilityId, type, attendees } = req.body;

    // Check if the availability exists
    const availability = await Availability.findById(availabilityId);
    if (!availability) {
      return res.status(404).json({ error: 'Availability not found' });
    }

    // Ensure the authenticated user owns the availability
    if (availability.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to create a session for this availability' });
    }

    // Create and save the new session
    const session = new Session({
      user: req.user._id,
      start: availability.start,
      end: availability.end,
      type,
      attendees,
    });

    await session.save();

    // Mark the availability as booked
    availability.scheduledSlots.push({
      start: session.start,
      end: session.end,
      attendees: session.attendees,
    });

    await availability.save();

    // Send notification email to the user and attendees
    await sendSessionNotification(session);

    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: 'Error creating session' });
  }
};

// Get all sessions for the authenticated user
export const getUserSessions = async (req: AuthRequest, res: Response) => {
  try {
    const sessions = await Session.find({ user: req.user._id });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user sessions' });
  }
};

// Get a single session by ID
export const getSessionById = async (req: AuthRequest, res: Response) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching session' });
  }
};

// Update a session (type or attendees)
export const updateSession = async (req: AuthRequest, res: Response) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['type', 'attendees'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    // Find the session to update
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Apply the updates
    updates.forEach((update) => {
      (session as any)[update] = req.body[update];
    });

    await session.save();

    // Send notification about the updated session
    await sendSessionNotification(session, 'update');

    res.json(session);
  } catch (error) {
    res.status(400).json({ error: 'Error updating session' });
  }
};

// Delete a session by ID
export const deleteSession = async (req: AuthRequest, res: Response) => {
  try {
    const session = await Session.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Remove the scheduled slot from the availability
    await Availability.findOneAndUpdate(
      { user: req.user._id, 'scheduledSlots.start': session.start, 'scheduledSlots.end': session.end },
      { $pull: { scheduledSlots: { start: session.start, end: session.end } } }
    );

    // Send cancellation notification
    await sendSessionNotification(session, 'cancel');

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting session' });
  }
};

// Admin: Get all sessions
export const getAllSessions = async (req: AuthRequest, res: Response) => {
  try {
    const sessions = await Session.find({}).populate('user', 'email');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching all sessions' });
  }
};
