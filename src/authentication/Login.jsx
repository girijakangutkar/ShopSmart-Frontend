import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { authContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, fetchUserInfo } = useContext(authContext);
  const API = import.meta.env.VITE_BACKEND_API;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const info = await axios.post(`${API}/api/login`, {
        email: data.email,
        password: data.password,
      });
      const { accessToken } = info.data;
      localStorage.setItem("token", accessToken);

      const decoded = jwtDecode(accessToken);
      setUser({ userId: decoded.userId, role: decoded.role });

      await fetchUserInfo(decoded.userId);

      navigate("/");
      console.log("Login success", info);
    } catch (error) {
      const errorMsg =
        error.response?.data?.msg || "Something went wrong. Please try again.";
      setErrMsg(errorMsg);
    } finally {
      setLoading(false);
      setData("");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col border-1 border-slate-400 shadow-sm p-6 absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] justify-center items-center text-left align-left w-[80%] sm:[80%] md:w-[40%] xl:w-[25%] 2xl:w-[25%]">
        {/* Title Skeleton */}
        <div className="h-6 w-3/4 mb-4 bg-gray-200 rounded animate-pulse"></div>

        {/* Error Message Slot (empty but reserved space) */}
        <div className="h-4 w-full mb-2"></div>

        {/* Email Label & Input Skeleton */}
        <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse mb-1"></div>
        <div className="h-8 w-full bg-gray-100 rounded animate-pulse mb-3"></div>

        {/* Password Label & Input Skeleton */}
        <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse mb-1"></div>
        <div className="h-8 w-full bg-gray-100 rounded animate-pulse mb-2"></div>

        {/* Forgot Password Link Skeleton */}
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse self-end mb-4"></div>

        {/* Login Button Skeleton */}
        <div className="h-10 w-full bg-gray-300 rounded animate-pulse mb-4"></div>

        {/* Divider Skeleton */}
        <div className="h-px w-1/2 bg-gray-200 my-2"></div>

        {/* Signup Prompt Skeleton */}
        <div className="flex space-x-1">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <form
        onSubmit={handleLogin}
        className="flex flex-col border-1 border-slate-400 shadow-sm p-6 absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] justify-center items-center text-left align-left w-[80%] sm:[80%] md:w-[40%] xl:[w-25%] 2xl:w-[25%]"
      >
        <h3 className="font-semibold text-[18px] text-gray-600 text-left w-full mb-3">
          Please login here:
        </h3>
        {errMsg && (
          <p className="text-sm text-red-600 text-left w-full">{errMsg}</p>
        )}
        <label
          htmlFor="email"
          className="text-gray-700 text-left w-full mt-2 mb-2"
        >
          Email
        </label>
        <input
          name="email"
          type="email"
          value={data.email}
          onChange={handleChange}
          required
          className="border border-[#ccc] w-full shadow-md p-1.5 text-md text-gray-700 text-sm"
          placeholder="Enter your email"
        />
        <label
          htmlFor="password"
          className="text-gray-700 text-left w-full mt-2 mb-2"
        >
          Password
        </label>
        <input
          name="password"
          type="password"
          value={data.password}
          onChange={handleChange}
          required
          className="border border-[#ccc] w-full shadow-md p-1.5 text-md text-gray-700 text-sm"
          placeholder="Enter your password"
        />
        <div className="flex flex-row text-sm text-gray-600 mt-3 w-full">
          <Link
            to="/forgotPassword"
            className="ml-1 text-slate-700 font-semibold w-full text-right"
          >
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          className="bg-slate-800 w-full m-4 p-2 shadow-md text-white font-bold text-md"
        >
          Login
        </button>
        <hr className="w-1/2 border-t-0.5 border-gray-900 my-2" />

        <div className="flex flex-row text-sm text-gray-600">
          <p>Do not have account? </p>
          <Link to="/signup" className="ml-1 text-slate-700 font-semibold">
            Signup
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
