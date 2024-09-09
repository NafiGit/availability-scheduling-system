// src/components/AvailabilityCalendar.jsx

import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/calendly-style.css';

const AvailabilityCalendar = ({ onDateSelect, selectedDate, availabilities }) => {
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const hasAvailability = availabilities.some(
        a => new Date(a.start).toDateString() === date.toDateString()
      );
      return hasAvailability ? <div className="has-availability"></div> : null;
    }
  };

  return (
    <div className="availability-calendar">
      <h2>Select Date</h2>
      <Calendar 
        onChange={onDateSelect} 
        value={selectedDate} 
        tileContent={tileContent}
      />
    </div>
  );
};

export default AvailabilityCalendar;