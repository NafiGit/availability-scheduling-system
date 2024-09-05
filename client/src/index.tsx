// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { AvailabilityProvider } from './contexts/AvailabilityContext';
import { SessionProvider } from './contexts/SessionContext';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider>
        <AvailabilityProvider>
          <SessionProvider>
            <App />
          </SessionProvider>
        </AvailabilityProvider>
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);