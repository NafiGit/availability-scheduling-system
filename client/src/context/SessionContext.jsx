// src/context/SessionContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const SessionContext = createContext();

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

export const SessionProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, logout } = useAuth(); // Get authentication token and logout function

  // Create an axios instance with authentication
  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const handleApiError = (error, customMessage) => {
    console.error(customMessage, error);
    if (error.response) {
      if (error.response.status === 401) {
        setError("Your session has expired. Please log in again.");
        // logout(); // Log out the user if the token is invalid or expired
      } else {
        setError(
          error.response.data.message || "An error occurred. Please try again."
        );
      }
    } else if (error.request) {
      setError(
        "No response received from the server. Please check your internet connection."
      );
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
    setLoading(false);
  };

  const getUserSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/session");
      setSessions(response.data);
    } catch (error) {
      handleApiError(error, "Error fetching user sessions:");
    } finally {
      setLoading(false);
    }
  };

  const getSessionById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/session/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error fetching session by ID:");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (session) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/session", session);
      setSessions([...sessions, response.data]);
      return response.data;
    } catch (error) {
      handleApiError(error, "Error creating session:");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSession = async (id, session) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/session/${id}`, session);
      setSessions(sessions.map((s) => (s.id === id ? response.data : s)));
      return response.data;
    } catch (error) {
      handleApiError(error, "Error updating session:");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/session/${id}`);
      setSessions(sessions.filter((s) => s.id !== id));
      return true;
    } catch (error) {
      handleApiError(error, "Error deleting session:");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getAllSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/session/all");
      setSessions(response.data);
    } catch (error) {
      handleApiError(error, "Error fetching all sessions:");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getUserSessions();
    }
  }, [token]);

  const value = {
    sessions,
    loading,
    error,
    getUserSessions,
    getSessionById,
    createSession,
    updateSession,
    deleteSession,
    getAllSessions,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};
