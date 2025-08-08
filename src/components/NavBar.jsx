import React, { useContext, useEffect, useId, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { ShoppingBagOpen } from "@phosphor-icons/react";
import { authContext } from "../context/AuthContext";

const NavBar = () => {
  const navigate = useNavigate();
  const { user, setUser, loading } = useContext(authContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="w-full p-3 bg-slate-900 flex flex-row fixed top-0 justify-between z-1000">
      <div className="flex justify-center items-center">
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
            <div className="flex items-center mr-4 ">
              <img
                src={user.profilePhoto}
                alt="Profile"
                className="w-8 h-8 rounded-full mr-2"
              />
              <span
                className="text-white text-md cursor-pointer"
                onClick={toggleDropdown}
              >
                {loading ? "Loading..." : user?.name || "User"} ▾
                {isOpen && (
                  <ul className="flex flex-col absolute bg-white text-gray-700 p-3 text-sm text-left mt-2 rounded-sm font-semibold w-[20%] sm:w-[10%] md:w-[25%] xl:w-[10%] 2xl:w-[10%]">
                    {user.role !== "seller" && (
                      <li>
                        <NavLink to="/orderHistory">Order history</NavLink>
                      </li>
                    )}

                    <li>
                      <NavLink to="/userProfile">User profile</NavLink>
                    </li>
                  </ul>
                )}
              </span>
            </div>
            {user && (user.role === "user" || user.role === "admin") && (
              <NavLink
                to="/cart"
                className="flex flex-row gap-2 items-center text-white text-md mr-4"
              >
                <ShoppingBagOpen size={20} color={"pink"} /> Cart
              </NavLink>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded-md text-sm cursor-pointer"
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
