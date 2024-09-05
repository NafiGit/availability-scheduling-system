import React, { useState } from 'react';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import TimeSlotSelector from '../components/TimeSlotSelector';
import SessionsList from '../components/SessionsList';
import { useAvailability } from '../contexts/AvailabilityContext';
import { useSession } from '../contexts/SessionContext';

const UserDashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { availabilities, addAvailability } = useAvailability();
  const { sessions } = useSession();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeSlotSelect = (start: Date, end: Date) => {
    addAvailability(start, end);
  };

  return (
    <div>
      <h1>User Dashboard</h1>
      <div>
        <h2>Set Your Availability</h2>
        <AvailabilityCalendar onDateSelect={handleDateSelect} />
        {selectedDate && (
          <TimeSlotSelector date={selectedDate} onTimeSlotSelect={handleTimeSlotSelect} />
        )}
      </div>
      <div>
        <h2>Your Availabilities</h2>
        {/* Display user's availabilities */}
      </div>
      <div>
        <h2>Your Scheduled Sessions</h2>
        <SessionsList sessions={sessions} />
      </div>
    </div>
  );
};

export default UserDashboard;
