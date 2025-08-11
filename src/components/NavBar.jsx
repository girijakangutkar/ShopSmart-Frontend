import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { ShoppingBagOpen } from "@phosphor-icons/react";
import { authContext } from "../context/AuthContext";

const NavBar = () => {
  const navigate = useNavigate();
  const { user, setUser, loading } = useContext(authContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="w-full p-3 bg-slate-900 flex flex-row fixed top-0 justify-between z-50 shadow-md">
      <div className="flex items-center">
        <NavLink
          to="/"
          className="text-white mr-4 text-md hover:text-pink-300 transition-colors"
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className="text-white mr-4 text-md hover:text-pink-300 transition-colors"
        >
          About
        </NavLink>
        {user && (user.role === "seller" || user.role === "admin") && (
          <NavLink
            to="/addProduct"
            className="text-white mr-4 text-md hover:text-pink-300 transition-colors"
          >
            Add Product
          </NavLink>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {!user ? (
          <>
            <NavLink
              to="/signup"
              className="text-white text-md hover:text-pink-300 transition-colors px-3 py-1 rounded"
            >
              Signup
            </NavLink>
            <NavLink
              to="/login"
              className="text-white text-md hover:text-pink-300 transition-colors px-3 py-1 rounded"
            >
              Login
            </NavLink>
          </>
        ) : (
          <>
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center cursor-pointer group"
                onClick={toggleDropdown}
              >
                <img
                  src={user.profilePhoto}
                  alt="Profile"
                  className="w-8 h-8 rounded-full mr-2 border-2 border-transparent group-hover:border-pink-300 transition-all"
                />
                <span className="text-white text-md group-hover:text-pink-300 transition-colors flex items-center">
                  {loading ? "Loading..." : user?.name || "User"}
                  <svg
                    className={`ml-1 w-4 h-4 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </div>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  {user.role === "user" && (
                    <>
                      <NavLink
                        to="/orderHistory"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                        onClick={() => setIsOpen(false)}
                      >
                        Order History
                      </NavLink>
                      <NavLink
                        to="/wishList"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                        onClick={() => setIsOpen(false)}
                      >
                        Wishlist
                      </NavLink>
                    </>
                  )}
                  <NavLink
                    to="/userProfile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                    onClick={() => setIsOpen(false)}
                  >
                    User Profile
                  </NavLink>
                </div>
              )}
            </div>

            {user && user.role === "user" && (
              <NavLink
                to="/cart"
                className="flex items-center text-white text-md hover:text-pink-300 transition-colors"
              >
                <div className="relative">
                  <ShoppingBagOpen size={20} className="text-pink-300" />
                  {/* Optional: Add cart count badge here */}
                </div>
                <span className="ml-1 hidden sm:inline">Cart</span>
              </NavLink>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors shadow-sm"
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
