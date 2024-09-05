import React from 'react';

interface User {
  id: string;
  email: string;
}

interface UserListProps {
  users: User[];
  onUserSelect: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onUserSelect }) => {
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
