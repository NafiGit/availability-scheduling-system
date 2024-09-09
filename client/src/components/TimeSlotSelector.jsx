// src/components/TimeSlotSelector.jsx

import React, { useState } from 'react';
import '../styles/calendly-style.css';

const TimeSlotSelector = ({ date, onTimeSlotSelect, existingAvailabilities }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [duration, setDuration] = useState(30); // Default duration of 30 minutes

  const handleSubmit = (e) => {
    e.preventDefault();
    const start = new Date(date.setHours(startTime.split(':')[0], startTime.split(':')[1]));
    const end = new Date(date.setHours(endTime.split(':')[0], endTime.split(':')[1]));
    onTimeSlotSelect(start, end, duration);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        required
      />
      <input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        required
      />
      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(parseInt(e.target.value))}
        min="15"
        step="15"
        required
      />
      <button type="submit">Add Availability</button>
    </form>
  );
};

export default TimeSlotSelector;