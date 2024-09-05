import React, { useState } from 'react';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import TimeSlotSelector from '../components/TimeSlotSelector';

const UserAvailability: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeSlotSelect = (start: Date, end: Date) => {
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
