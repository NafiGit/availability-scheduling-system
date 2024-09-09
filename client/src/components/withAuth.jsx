// src/components/withAuth.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const withAuth = (WrappedComponent) => {
  const WithAuthComponent = (props) => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (isAuthenticated) {
        navigate("/dashboard");
      }
    }, [isAuthenticated, navigate]);

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
};

export default withAuth;
