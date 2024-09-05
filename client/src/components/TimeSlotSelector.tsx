import React, { useState } from 'react';

interface TimeSlotSelectorProps {
  date: Date;
  onTimeSlotSelect: (start: Date, end: Date) => void;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({ date, onTimeSlotSelect }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(date.setHours(parseInt(startTime.split(':')[0]), parseInt(startTime.split(':')[1])));
    const end = new Date(date.setHours(parseInt(endTime.split(':')[0]), parseInt(endTime.split(':')[1])));
    onTimeSlotSelect(start, end);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Select Time Slot</h3>
      <div>
        <label>Start Time:</label>
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
      </div>
      <div>
        <label>End Time:</label>
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
      </div>
      <button type="submit">Add Time Slot</button>
    </form>
  );
};

export default TimeSlotSelector;
