// models/Session.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  user: mongoose.Types.ObjectId;
  start: Date;
  end: Date;
  type: string;
  attendees: Array<{
    name: string;
    email: string;
  }>;
}

const SessionSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  type: { type: String, required: true },
  attendees: [{
    name: { type: String, required: true },
    email: { type: String, required: true },
  }],
});

export default mongoose.model<ISession>('Session', SessionSchema);