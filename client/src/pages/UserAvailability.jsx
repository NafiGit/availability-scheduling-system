// src/pages/UserAvailability.jsx

import React, { useState } from 'react';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import TimeSlotSelector from '../components/TimeSlotSelector';

const UserAvailability = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSlotSelect = (start, end) => {
    // TODO: Send availability to backend
    console.log('Selected time slot:', { start, end });
  };

  return (
    <div>
      <h1>Set Your Availability</h1>
      <AvailabilityCalendar onDateSelect={handleDateSelect} />
      {selectedDate && (
        <TimeSlotSelector date={selectedDate} onTimeSlotSelect={handleTimeSlotSelect} />
      )}
    </div>
  );
};

export default UserAvailability;


