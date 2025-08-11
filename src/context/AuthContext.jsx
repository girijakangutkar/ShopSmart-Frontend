import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const authContext = createContext(null);

const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_BACKEND_API;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ userId: decoded.userId, role: decoded.role });
        fetchUserInfo(decoded.userId);
      } catch (error) {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const fetchUserInfo = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Fetched user:", response.data.user);

      setUser((prev) => ({ ...prev, ...response.data.user }));
    } catch (error) {
      console.log("Failed to fetch user info");
    } finally {
      setLoading(false);
    }
  };

  return (
    <authContext.Provider value={{ user, setUser, fetchUserInfo, loading }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthContext;
