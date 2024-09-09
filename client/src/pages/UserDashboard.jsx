// src/pages/UserDashboard.jsx

import React, { useEffect } from "react";
import AvailabilityCalendar from "../components/AvailabilityCalendar";
import SessionsList from "../components/SessionsList";
import { useAvailability } from "../context/AvailabilityContext";
import { useSession } from "../context/SessionContext";
import "../styles/calendly-style.css";

const UserDashboard = () => {
  const {
    availabilities,
    loading: availabilityLoading,
    error: availabilityError,
    getUserAvailability,
  } = useAvailability();
  // const {
  //   sessions,
  //   loading: sessionLoading,
  //   error: sessionError,
  //   getUserSessions,
  // } = useSession();

  useEffect(() => {
    getUserAvailability();
    // getUserSessions();
  }, []);

  if (availabilityLoading) return <div className="loading">Loading...</div>;
  if (availabilityError)
    return <div className="error">An error occurred. Please try again.</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">User Dashboard</h1>
      <div className="dashboard-content">
        <div className="availability-section">
          <h2>Set Your Availability</h2>
          <AvailabilityCalendar availabilities={availabilities} />
        </div>
        <div className="sessions-section">
          <h2>Your Sessions</h2>
          {/* <SessionsList sessions={sessions} /> */}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
