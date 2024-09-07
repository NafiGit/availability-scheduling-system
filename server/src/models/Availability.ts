// models/Availability.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IAvailability extends Document {
  user: mongoose.Types.ObjectId;
  start: Date;
  end: Date;
  duration: number;
  scheduledSlots: Array<{
    start: Date;
    end: Date;
    attendees: Array<{
      name: string;
      email: string;
    }>;
  }>;
}

const AvailabilitySchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  duration: { type: Number, required: true },
  scheduledSlots: [{
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    attendees: [{
      name: { type: String, required: true },
      email: { type: String, required: true },
    }],
  }],
});

export default mongoose.model<IAvailability>('Availability', AvailabilitySchema);
