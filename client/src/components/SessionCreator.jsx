// src/components/SessionCreator.tsx

import React, { useState } from 'react';

const SessionCreator= ({ userId, availabilities, onSessionCreate }) => {
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [sessionType, setSessionType] = useState<'one-on-one' | 'group'>('one-on-one');
  const [attendees, setAttendees] = useState<string>('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const availability = availabilities.find(a => a.id === selectedAvailability);
    if (!availability) return;

    const session = {
      userId,
      start: availability.start,
      end: availability.end,
      type: sessionType,
      attendees: attendees.split(',').map(email => email.trim()),
    };

    onSessionCreate(session);
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        value={selectedAvailability}
        onChange={(e) => setSelectedAvailability(e.target.value)}
        required
      >
        <option value="">Select an availability</option>
        {availabilities.map(a => (
          <option key={a.id} value={a.id}>
            {a.start.toLocaleString()} - {a.end.toLocaleString()}
          </option>
        ))}
      </select>
      <select
        value={sessionType}
        onChange={(e) => setSessionType(e.target.value)}
        required
      >
        <option value="one-on-one">One-on-One</option>
        <option value="group">Group</option>
      </select>
      <input
        type="text"
        placeholder="Attendee emails (comma-separated)"
        value={attendees}
        onChange={(e) => setAttendees(e.target.value)}
        required
      />
      <button type="submit">Create Session</button>
    </form>
  );
};

export default SessionCreator;

