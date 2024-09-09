// src/components/UserList.tsx

import React from 'react';

const UserList = ({ users, onUserSelect }) => {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id} onClick={() => onUserSelect(user.id)}>
          {user.email}
        </li>
      ))}
    </ul>
  );
};

export default UserList;

