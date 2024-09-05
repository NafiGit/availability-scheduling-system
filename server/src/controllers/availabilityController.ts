import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Availability from '../models/Availability';

export const getUserAvailability = async (req: AuthRequest, res: Response) => {
  try {
    const availabilities = await Availability.find({ user: req.user._id });
    res.json(availabilities);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching availabilities' });
  }
};

export const createAvailability = async (req: AuthRequest, res: Response) => {
  try {
    const { start, end, duration } = req.body;
    const availability = new Availability({
      user: req.user._id,
      start,
      end,
      duration
    });
    await availability.save();
    res.status(201).json(availability);
  } catch (error) {
    res.status(400).json({ error: 'Error creating availability' });
  }
};

export const updateAvailability = async (req: AuthRequest, res: Response) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['start', 'end', 'duration'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    const availability = await Availability.findOne({ _id: req.params.id, user: req.user._id });
    if (!availability) {
      return res.status(404).json({ error: 'Availability not found' });
    }

    updates.forEach((update) => {
      (availability as any)[update] = req.body[update];
    });

    await availability.save();
    res.json(availability);
  } catch (error) {
    res.status(400).json({ error: 'Error updating availability' });
  }
};

export const deleteAvailability = async (req: AuthRequest, res: Response) => {
  try {
    const availability = await Availability.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!availability) {
      return res.status(404).json({ error: 'Availability not found' });
    }
    res.json({ message: 'Availability deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting availability' });
  }
};

export const getAllAvailabilities = async (req: AuthRequest, res: Response) => {
  try {
    const availabilities = await Availability.find({}).populate('user', 'email');
    res.json(availabilities);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching all availabilities' });
  }
};