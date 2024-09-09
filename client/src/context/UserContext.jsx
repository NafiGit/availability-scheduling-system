import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const { user: authUser, isAuthenticated } = useAuth();

  const getCurrentUser = async () => {
    if (!isAuthenticated || !authUser) return null;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/user/${authUser.userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  };

  const getUserById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return null;
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/user/${id}`,
        userData
      );
      setUsers(users.map((user) => (user.id === id ? response.data : user)));
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/user/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && authUser?.isAdmin) {
      getAllUsers();
    }
  }, [isAuthenticated, authUser]);

  const value = {
    users,
    getCurrentUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
