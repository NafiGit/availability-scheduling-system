import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext"; // Assume you have an AuthContext

const AvailabilityContext = createContext();

export const useAvailability = () => {
  const context = useContext(AvailabilityContext);
  if (!context) {
    throw new Error("useAvailability must be used within an AvailabilityProvider");
  }
  return context;
};

export const AvailabilityProvider = ({ children }) => {
  const [availabilities, setAvailabilities] = useState([]);
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
        logout(); // Log out the user if the token is invalid or expired
      } else {
        setError(error.response.data.message || "An error occurred. Please try again.");
      }
    } else if (error.request) {
      setError("No response received from the server. Please check your internet connection.");
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
    setLoading(false);
  };

  const getUserAvailability = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/availability");
      setAvailabilities(response.data);
    } catch (error) {
      handleApiError(error, "Error fetching user availability:");
    } finally {
      setLoading(false);
    }
  };

  const createAvailability = async (availability) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/availability", availability);
      setAvailabilities([...availabilities, response.data]);
    } catch (error) {
      handleApiError(error, "Error creating availability:");
    } finally {
      setLoading(false);
    }
  };

  const updateAvailability = async (id, availability) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/availability/${id}`, availability);
      setAvailabilities(availabilities.map((a) => (a.id === id ? response.data : a)));
    } catch (error) {
      handleApiError(error, "Error updating availability:");
    } finally {
      setLoading(false);
    }
  };

  const deleteAvailability = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/availability/${id}`);
      setAvailabilities(availabilities.filter((a) => a.id !== id));
    } catch (error) {
      handleApiError(error, "Error deleting availability:");
    } finally {
      setLoading(false);
    }
  };

  const getAllAvailabilities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/availability/all");
      setAvailabilities(response.data);
    } catch (error) {
      handleApiError(error, "Error fetching all availabilities:");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAvailability();
    }
  }, [token]);

  const value = {
    availabilities,
    loading,
    error,
    getUserAvailability,
    createAvailability,
    updateAvailability,
    deleteAvailability,
    getAllAvailabilities,
  };

  return (
    <AvailabilityContext.Provider value={value}>
      {children}
    </AvailabilityContext.Provider>
  );
};