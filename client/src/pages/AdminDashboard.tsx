import React, { useState } from 'react';
import UserList from '../components/UserList';
import AdminCalendar from '../components/AdminCalendar';
import SessionCreator from '../components/SessionCreator';
import { useUser } from '../contexts/UserContext';
import { useAvailability } from '../contexts/AvailabilityContext';
import { useSession } from '../contexts/SessionContext';

const AdminDashboard: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const { users } = useUser();
  const { availabilities } = useAvailability();
  const { sessions, addSession } = useSession();

  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId);
  };

  const handleSessionCreate = (session: any) => {
    addSession(session);
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
            availabilities={availabilities.filter(a => a.user === selectedUser)}
          />
          <SessionCreator
            userId={selectedUser}
            availabilities={availabilities.filter(a => a.user === selectedUser)}
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
