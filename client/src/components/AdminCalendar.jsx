// src/components/AdminCalendar.tsx

import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


const AdminCalendar= ({ availabilities }) => {
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const availableOnDay = availabilities.some(
        (a) => a.start.toDateString() === date.toDateString()
      );
      return availableOnDay ? <p>Available</p> : null;
    }
  };

  return <Calendar tileContent={tileContent} />;
};

export default AdminCalendar;

