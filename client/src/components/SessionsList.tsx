import React from 'react';

interface Session {
  id: string;
  start: Date;
  end: Date;
  type: 'one-on-one' | 'group';
  attendees: string[];
}

interface SessionsListProps {
  sessions: Session[];
}

const SessionsList: React.FC<SessionsListProps> = ({ sessions }) => {
  return (
    <ul>
      {sessions.map(session => (
        <li key={session.id}>
          <p>Time: {session.start.toLocaleString()} - {session.end.toLocaleString()}</p>
          <p>Type: {session.type}</p>
          <p>Attendees: {session.attendees.join(', ')}</p>
        </li>
      ))}
    </ul>
  );
};

export default SessionsList;
