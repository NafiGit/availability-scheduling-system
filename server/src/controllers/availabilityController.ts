import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Availability from '../models/Availability';
import { isValidObjectId } from 'mongoose';

export const getUserAvailability = async (req: AuthRequest, res: Response) => {
  try {
    const availabilities = await Availability.find({ user: req.user._id });
    res.json(availabilities);
  } catch (error) {
    console.error('Error in getUserAvailability:', error);
    res.status(500).json({ error: 'An unexpected error occurred while fetching availabilities' });
  }
};

export const createAvailability = async (req: AuthRequest, res: Response) => {
  try {
    const { start, end, duration } = req.body;

    console.log('Received data:', { start, end, duration }); // Log received data

    if (!start || !end || duration === undefined) {
      return res.status(400).json({ error: 'Missing required fields: start, end, or duration' });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format for start or end' });
    }

    if (startDate >= endDate) {
      return res.status(400).json({ error: 'Start time must be before end time' });
    }

    if (typeof duration !== 'number' || duration <= 0) {
      return res.status(400).json({ error: 'Invalid duration: must be a positive number' });
    }

    const availability = new Availability({
      user: req.user._id,
      start: startDate,
      end: endDate,
      duration
    });

    await availability.save();
    res.status(201).json(availability);
  } catch (error) {
    console.error('Error in createAvailability:', error);
    res.status(500).json({ error: 'An unexpected error occurred while creating availability' });
  }
};

export const updateAvailability = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid availability ID' });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['start', 'end', 'duration'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    const availability = await Availability.findOne({ _id: id, user: req.user._id });
    if (!availability) {
      return res.status(404).json({ error: 'Availability not found' });
    }

    updates.forEach((update) => {
      (availability as any)[update] = req.body[update];
    });

    if (new Date(availability.start) >= new Date(availability.end)) {
      return res.status(400).json({ error: 'Start time must be before end time' });
    }

    if (typeof availability.duration !== 'number' || availability.duration <= 0) {
      return res.status(400).json({ error: 'Invalid duration' });
    }

    await availability.save();
    res.json(availability);
  } catch (error) {
    console.error('Error in updateAvailability:', error);
    res.status(500).json({ error: 'An unexpected error occurred while updating availability' });
  }
};

export const deleteAvailability = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid availability ID' });
    }

    const availability = await Availability.findOneAndDelete({ _id: id, user: req.user._id });
    if (!availability) {
      return res.status(404).json({ error: 'Availability not found' });
    }
    res.json({ message: 'Availability deleted successfully' });
  } catch (error) {
    console.error('Error in deleteAvailability:', error);
    res.status(500).json({ error: 'An unexpected error occurred while deleting availability' });
  }
};

export const getAllAvailabilities = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admin rights required.' });
    }
    const availabilities = await Availability.find({}).populate('user', 'email');
    res.json(availabilities);
  } catch (error) {
    console.error('Error in getAllAvailabilities:', error);
    res.status(500).json({ error: 'An unexpected error occurred while fetching all availabilities' });
  }
};

export const getAvailabilitiesByDate = async (req: AuthRequest, res: Response) => {
  try {
    const { date } = req.params;
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const availabilities = await Availability.find({
      user: req.user._id,
      start: { $gte: startOfDay, $lte: endOfDay }
    }).sort('start');

    // Format the availabilities to ensure consistent date strings
    const formattedAvailabilities = availabilities.map(a => ({
      ...a.toObject(),
      start: a.start.toISOString(),
      end: a.end.toISOString()
    }));

    res.json(formattedAvailabilities);
  } catch (error) {
    console.error('Error in getAvailabilitiesByDate:', error);
    res.status(500).json({ error: 'An unexpected error occurred while fetching availabilities for the date' });
  }
};