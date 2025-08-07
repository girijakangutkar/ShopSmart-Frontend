import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const info = await axios.post(
        "http://localhost:3000/api/forgotPassword",
        { email: email }
      );
      console.log("Reset password link will be sent", info);
    } catch (error) {
      const errorMsg =
        error.response?.data?.msg || "Something went wrong. Please try again.";
      setErrMsg(errorMsg);
    } finally {
      setLoading(false);
      setEmail("");
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
          Fill out this form:
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-[#ccc] w-full shadow-md p-1.5 text-md text-gray-700 text-sm"
          placeholder="Enter your email"
        />
        <button
          type="submit"
          className="bg-green-500 w-full m-4 p-2 shadow-md text-white font-bold text-md"
        >
          Send reset link
        </button>
        <div className="flex flex-row text-sm text-gray-600">
          <p>Remember your password? </p>
          <Link to="/login" className="ml-1 text-slate-700 font-semibold">
            login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
