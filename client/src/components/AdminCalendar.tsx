import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface Availability {
  id: string;
  start: Date;
  end: Date;
}

interface AdminCalendarProps {
  availabilities: Availability[];
}

const AdminCalendar: React.FC<AdminCalendarProps> = ({ availabilities }) => {
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const availableOnDay = availabilities.some(
        a => a.start.toDateString() === date.toDateString()
      );
      return availableOnDay ? <p>Available</p> : null;
    }
  };

  return <Calendar tileContent={tileContent} />;
};

export default AdminCalendar;
