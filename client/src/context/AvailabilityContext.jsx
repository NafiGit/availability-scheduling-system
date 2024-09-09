import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const AvailabilityContext = createContext();

export const useAvailability = () => {
  const context = useContext(AvailabilityContext);
  if (!context) {
    throw new Error(
      "useAvailability must be used within an AvailabilityProvider"
    );
  }
  return context;
};

export const AvailabilityProvider = ({ children }) => {
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
  });

  // Set up interceptor to add the token to every request
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const handleApiError = (error, customMessage) => {
    console.error(customMessage, error);
    if (error.response) {
      if (error.response.status === 401) {
        setError("Your session has expired. Please log in again.");
        // logout();
      } else {
        setError(
          error.response.data.error || "An error occurred. Please try again."
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
      console.log("Sending availability data:", availability); // Log the data being sent
      const response = await api.post("/availability", availability);
      setAvailabilities([...availabilities, response.data]);
    } catch (error) {
      handleApiError(error, "Error creating availability:");
      if (error.response && error.response.data) {
        console.log("Server error response:", error.response.data); // Log the server's error response
      }
    } finally {
      setLoading(false);
    }
  };

  const updateAvailability = async (id, availability) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/availability/${id}`, availability);
      setAvailabilities(
        availabilities.map((a) => (a._id === id ? response.data : a))
      );
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
      setAvailabilities(availabilities.filter((a) => a._id !== id));
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
    if (user) {
      getUserAvailability();
    }
  }, [user]);

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

export default AvailabilityProvider;
