// src/pages/UserDashboard.jsx

import React, { useState, useEffect } from 'react';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import TimeSlotSelector from '../components/TimeSlotSelector';
import SessionsList from '../components/SessionsList';
import { useAvailability } from '../context/AvailabilityContext';
import { useSession } from '../context/SessionContext';
import '../styles/calendly-style.css';

const UserDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { createAvailability, availabilities, loading: availabilityLoading, error: availabilityError } = useAvailability();
  const { sessions, loading: sessionLoading, error: sessionError } = useSession();

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSlotSelect = async (start, end) => {
    await createAvailability({ start, end });
  };

  if (availabilityLoading || sessionLoading) return <div className="loading">Loading...</div>;
  if (availabilityError || sessionError) return <div className="error">An error occurred. Please try again.</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">User Dashboard</h1>
      <div className="dashboard-content">
        <div className="availability-section">
          <h2>Set Your Availability</h2>
          <AvailabilityCalendar 
            onDateSelect={handleDateSelect} 
            selectedDate={selectedDate}
            availabilities={availabilities}
          />
          <TimeSlotSelector 
            date={selectedDate} 
            onTimeSlotSelect={handleTimeSlotSelect} 
            existingAvailabilities={availabilities.filter(a => 
              new Date(a.start).toDateString() === selectedDate.toDateString()
            )}
          />
        </div>
        <div className="sessions-section">
          <h2>Your Scheduled Sessions</h2>
          <SessionsList sessions={sessions} />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;