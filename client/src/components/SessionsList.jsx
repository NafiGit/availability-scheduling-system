// src/components/SessionsList.tsx

import React from 'react';
import '../styles/calendly-style.css';

const SessionsList = ({ sessions }) => {
  return (
    <div className="sessions-list">
      {sessions.length === 0 ? (
        <p>No scheduled sessions yet.</p>
      ) : (
        <ul>
          {sessions.map(session => (
            <li key={session.id} className="session-item">
              <div className="session-time">
                {new Date(session.start).toLocaleString()} - {new Date(session.end).toLocaleTimeString()}
              </div>
              <div className="session-type">{session.type}</div>
              <div className="session-attendees">
                Attendees: {session.attendees.map(attendee => attendee.name).join(', ')}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SessionsList;