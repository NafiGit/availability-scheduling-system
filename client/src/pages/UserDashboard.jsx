import React, { useState, useEffect } from "react";
import AvailabilityCalendar from "../components/AvailabilityCalendar";
import SessionsList from "../components/SessionsList";
import AvailabilityModal from "../components/AvailabilityModal";
import { useAvailability } from "../context/AvailabilityContext";
import "../styles/calendly-style.css";

const UserDashboard = () => {
  const {
    availabilities,
    loading: availabilityLoading,
    error: availabilityError,
    getUserAvailability,
    selectedDate,
    setSelectedDate
  } = useAvailability();

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    getUserAvailability();
  }, []);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedDate(null);
  };

  if (availabilityLoading) return <div className="loading">Loading...</div>;
  if (availabilityError) return <div className="error">An error occurred. Please try again.</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">User Dashboard</h1>
      <div className="dashboard-content">
        <div className="availability-section">
          <h2>Set Your Availability</h2>
          <AvailabilityCalendar 
            availabilities={availabilities} 
            onDateClick={handleDateClick}
          />
        </div>
        <div className="sessions-section">
          <h2>Your Sessions</h2>
          {/* <SessionsList sessions={sessions} /> */}
        </div>
      </div>
      <AvailabilityModal 
        isOpen={isModalVisible} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default UserDashboard;