// src/pages/AdminDashboard.tsx

import React, { useState } from 'react';
import UserList from '../components/UserList';
import AdminCalendar from '../components/AdminCalendar';
import SessionCreator from '../components/SessionCreator';
import { useUser } from '../context/UserContext';
import { useAvailability } from '../context/AvailabilityContext';
import { useSession } from '../context/SessionContext';

const AdminDashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const { users } = useUser();
  const { availabilities } = useAvailability();
  const { sessions, createSession } = useSession();

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
  };

  const handleSessionCreate = (session) => {
    createSession(session);
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <h2>Users</h2>
        <UserList users={users} onUserSelect={handleUserSelect} />
      </div>
      {selectedUser && (
        <div>
          <h2>User Availability</h2>
          <AdminCalendar
            availabilities={availabilities.filter((a) => a.user === selectedUser)}
          />
          <SessionCreator
            userId={selectedUser}
            availabilities={availabilities.filter((a) => a.user === selectedUser)}
            onSessionCreate={handleSessionCreate}
          />
        </div>
      )}
      <div>
        <h2>All Scheduled Sessions</h2>
        {/* Display all sessions */}
      </div>
    </div>
  );
};

export default AdminDashboard;


