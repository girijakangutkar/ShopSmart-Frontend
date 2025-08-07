import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const NavBar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        fetchUserInfo(decoded.userId);
      } catch (error) {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const fetchUserInfo = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Fetched user:", response.data.user);

      setUser(response.data.user);
    } catch (error) {
      console.log("Failed to fetch user info");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser("");
    navigate("/login");
  };

  return (
    <nav className="w-full p-3 bg-slate-900 flex flex-row fixed top-0 justify-between">
      <div>
        {/* {user && (user.role === "user" || user.role === "admin") && ( */}
        <NavLink to="/" className="text-white mr-4 text-md">
          Home
        </NavLink>
        {/* )} */}
        <NavLink to="/about" className="text-white mr-4 text-md">
          About
        </NavLink>
        {user && (user.role === "seller" || user.role === "admin") && (
          <NavLink to="/addProduct" className="text-white mr-4 text-md">
            Add Product
          </NavLink>
        )}
      </div>
      <div className="flex items-center">
        {!user ? (
          <>
            <NavLink to="/signup" className="text-white mr-4 text-md">
              Signup
            </NavLink>
            <NavLink to="/login" className="text-white mr-4 text-md">
              Login
            </NavLink>
          </>
        ) : (
          <>
            <div className="flex items-center mr-4">
              <img
                src={user.profilePhoto}
                alt="Profile"
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="text-white text-md">{user.name}</span>
            </div>
            {user && (user.role === "user" || user.role === "admin") && (
              <NavLink to="/cart" className="text-white text-md mr-3">
                Cart
              </NavLink>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
