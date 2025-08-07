import axios from "axios";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const resetToken = queryParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const processChange = await axios.put(
        `http://localhost:3000/api/resetPassword?token=${resetToken}`,
        { newPassword: newPassword }
      );
      console.log("Password reset success", processChange);
    } catch (error) {
      const errorMsg =
        error.response?.data?.msg || "Something went wrong. Please try again.";
      setErrMsg(errorMsg);
    } finally {
      setLoading(false);
      setNewPassword("");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col border-1 border-slate-400 shadow-sm p-6 absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] justify-center items-center text-left align-left w-[80%] sm:[80%] md:w-[40%] xl:[w-25%] 2xl:w-[25%]"
      >
        <h3 className="font-semibold text-[18px] text-gray-600 text-left w-full mb-3">
          Reset Password:
        </h3>
        {errMsg && (
          <p className="text-sm text-red-600 text-left w-full">{errMsg}</p>
        )}
        <label
          htmlFor="password"
          className="text-gray-700 text-left w-full mt-2 mb-2"
        >
          New Password
        </label>
        <input
          name="password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="border border-[#ccc] w-full shadow-md p-1.5 text-md text-gray-700 text-sm"
          placeholder="Enter your new password"
        />
        <button
          type="submit"
          className="bg-green-500 w-full m-4 p-2 shadow-md text-white font-bold text-md"
        >
          Reset password
        </button>
        <hr className="w-1/2 border-t-0.5 border-gray-900 my-2" />

        <div className="flex flex-row text-sm text-gray-600">
          <p>Try login...</p>
          <Link to="/login" className="ml-1 text-slate-700 font-semibold">
            login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
