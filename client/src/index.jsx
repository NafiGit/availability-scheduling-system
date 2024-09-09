import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { AvailabilityProvider } from "./context/AvailabilityContext";
import { SessionProvider } from "./context/SessionContext";

const root = createRoot(document.getElementById("root"));
root.render(
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
  </React.StrictMode>
);
