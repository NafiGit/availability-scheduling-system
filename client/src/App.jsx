// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AvailabilityCalendar from "./components/AvailabilityCalendar";
import UserList from "./components/UserList";
import withAuth from "./components/withAuth";

const App = () => {
  const { isAuthenticated, user } = useAuth();

  const ProtectedLogin = withAuth(Login);
  const ProtectedRegister = withAuth(Register);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<ProtectedLogin />} />
        <Route path="/register" element={<ProtectedRegister />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              user?.isAdmin ? (
                <AdminDashboard />
              ) : (
                <UserDashboard />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
