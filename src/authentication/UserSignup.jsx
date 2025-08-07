import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Signup = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    profilePhoto: null,
    password: "",
  });
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: name === "profilePhoto" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("role", "user");
    formData.append("profilePhoto", data.profilePhoto);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/signup",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Signup success", response.data);
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
    return <p>Loading...</p>;
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col border-1 border-slate-400 shadow-sm p-6 absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] justify-center items-center text-left align-left w-[80%] sm:[80%] md:w-[40%] xl:[w-25%] 2xl:w-[25%]"
      >
        <h3 className="font-semibold text-[18px] text-gray-600 text-left w-full mb-3">
          Please Signup here:
        </h3>
        {errMsg && (
          <p className="text-sm text-red-600 text-left w-full">{errMsg}</p>
        )}

        <label htmlFor="name" className="text-gray-700 text-left w-full">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={data.name}
          onChange={handleChange}
          required
          className="border border-[#ccc] w-full shadow-md p-1.5 text-md text-gray-700 text-sm"
          placeholder="Enter your name here"
        />
        <label
          htmlFor="email"
          className="text-gray-700 text-left w-full mt-2 mb-2"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
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
          type="password"
          name="password"
          value={data.password}
          onChange={handleChange}
          required
          className="border border-[#ccc] w-full shadow-md p-1.5 text-md text-gray-700 text-sm"
          placeholder="Enter your password"
        />
        <label
          htmlFor="profilePhoto"
          className="text-gray-700 text-left w-full mt-2 mb-2"
        >
          Profile Photo
        </label>
        <input
          type="file"
          name="profilePhoto"
          onChange={handleChange}
          className="border border-[#ccc] w-full shadow-md p-1.5 text-md text-gray-700 text-sm"
          placeholder="Upload your photo here"
        />
        <button
          type="submit"
          className="bg-green-500 w-full m-4 p-2 shadow-md text-white font-bold text-md"
        >
          Signup
        </button>
        <hr className="w-1/2 border-t-0.5 border-gray-900 my-2" />
        <div className="flex flex-row text-sm text-gray-600">
          <p>Already have an account? </p>
          <Link to="/login" className="ml-1 text-slate-700 font-semibold">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
