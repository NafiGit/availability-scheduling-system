// src/components/TimeSlotSelector.jsx

import React, { useState } from 'react';
import '../styles/calendly-style.css';

const TimeSlotSelector = ({ date, onTimeSlotSelect, existingAvailabilities }) => {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  const handleSubmit = (e) => {
    e.preventDefault();
    const start = new Date(date.setHours(parseInt(startTime.split(':')[0]), parseInt(startTime.split(':')[1])));
    const end = new Date(date.setHours(parseInt(endTime.split(':')[0]), parseInt(endTime.split(':')[1])));
    onTimeSlotSelect(start, end);
  };

  const timeSlots = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      timeSlots.push(`${i.toString().padStart(2, '0')}:${j.toString().padStart(2, '0')}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="time-slot-selector">
      <h3>Select Time Slot</h3>
      <div className="time-inputs">
        <div>
          <label>Start Time:</label>
          <select value={startTime} onChange={(e) => setStartTime(e.target.value)} required>
            {timeSlots.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
        <div>
          <label>End Time:</label>
          <select value={endTime} onChange={(e) => setEndTime(e.target.value)} required>
            {timeSlots.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>
      <button type="submit" className="add-timeslot-btn">Add Time Slot</button>
      <div className="existing-availabilities">
        <h4>Existing Availabilities</h4>
        {existingAvailabilities.map((availability, index) => (
          <div key={index} className="availability-item">
            {new Date(availability.start).toLocaleTimeString()} - {new Date(availability.end).toLocaleTimeString()}
          </div>
        ))}
      </div>
    </form>
  );
};

export default TimeSlotSelector;