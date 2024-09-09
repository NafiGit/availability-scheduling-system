// src/components/AvailabilityCalendar.jsx

import React, { useState, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/calendly-style.css';
import AvailabilityModal from './AvailabilityModal';
import { useAvailability } from '../context/AvailabilityContext';

const AvailabilityCalendar = ({ availabilities }) => {
  const { selectedDate, setSelectedDate } = useAvailability();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tileContent = useCallback(({ date, view }) => {
    if (view === 'month') {
      const hasAvailability = availabilities.some(
        a => new Date(a.start).toDateString() === date.toDateString()
      );
      return hasAvailability ? <div className="has-availability"></div> : null;
    }
  }, [availabilities]);

  const handleDateClick = useCallback((date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  }, [setSelectedDate]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedDate(null);
  }, [setSelectedDate]);

  return (
    <div className="availability-calendar">
      <h2>Select Date</h2>
      <Calendar 
        onChange={handleDateClick} 
        value={selectedDate || new Date()} 
        tileContent={tileContent}
      />
      {isModalOpen && <AvailabilityModal isOpen={isModalOpen} onClose={handleCloseModal} />}
    </div>
  );
};

export default React.memo(AvailabilityCalendar);