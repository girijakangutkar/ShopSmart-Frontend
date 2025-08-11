import axios from "axios";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { PenNib } from "@phosphor-icons/react";
import { Check } from "lucide-react";

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const API = import.meta.env.VITE_BACKEND_API;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        fetchUserData(decoded.userId);
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`${API}/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUserProfile(response.data.user);
    } catch (error) {
      console.error("Something went wrong while fetching user profile:", error);
    }
  };

  const handleProfileUpdate = async () => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const userId = decoded.userId;

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (profilePhoto) {
        formData.append("profilePhoto", profilePhoto);
      }

      const response = await axios.patch(
        `${API}/myInfo/updateProfile/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Profile updated", response);
      setEditing(false);

      fetchUserData(userId);
    } catch (error) {
      console.error("Something went wrong while editing user profile", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 mt-[4%]">
      {userProfile && (
        <div className="w-full max-w-2xl bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 border border-slate-700">
          {/* Profile Display */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <img
                src={userProfile.profilePhoto}
                className="h-40 w-40 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                alt="User profile"
              />
              {!isEditing && (
                <button
                  onClick={() => setEditing(true)}
                  className="absolute -bottom-2 right-2 bg-pink-600 hover:bg-pink-700 text-white p-2 rounded-full shadow-md transition-all transform hover:scale-105"
                  aria-label="Edit profile"
                >
                  <PenNib size={18} />
                </button>
              )}
            </div>

            <h1 className="mt-4 text-2xl font-bold text-white">
              {userProfile.name}
            </h1>

            {!isEditing && (
              <div className="mt-6 w-full max-w-md">
                {/* Additional profile info can go here */}
                {/* <div className="grid grid-cols-2 gap-4 text-left"> */}
                <div className="bg-slate-700 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-400">Member Since</p>
                  <p className="text-white font-medium">
                    {new Date(userProfile.createdAt).toLocaleDateString(
                      "en-IN"
                    )}
                  </p>
                  {/* </div> */}
                  {/* <div className="bg-slate-700 p-3 rounded-lg">
                    <p className="text-sm text-gray-400">Total Orders</p>
                    <p className="text-white font-medium">24</p>
                  </div> */}
                </div>
              </div>
            )}
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div className="mt-8">
              <div className="space-y-5">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white 
                focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent
                placeholder-gray-400 transition-all"
                  />
                </div>

                {/* Profile Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Profile Photo
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex-1 cursor-pointer">
                      <div className="flex flex-col items-center justify-center px-4 py-8 bg-slate-700 border-2 border-dashed border-slate-600 rounded-lg hover:border-pink-400 transition-all group">
                        <svg
                          className="w-10 h-10 text-gray-400 group-hover:text-pink-400 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="mt-3 text-sm text-gray-400 group-hover:text-pink-300 transition-colors">
                          {profilePhoto
                            ? profilePhoto.name
                            : "Click to upload or drag & drop"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProfilePhoto(e.target.files[0])}
                        className="hidden"
                      />
                    </label>

                    {profilePhoto && (
                      <button
                        onClick={() => setProfilePhoto(null)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        aria-label="Remove photo"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => setEditing(false)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-gray-300 py-3 px-4 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-slate-800
                transition-colors font-medium border border-slate-600 flex items-center justify-center"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProfileUpdate}
                    className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3 px-4 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-slate-800
                transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Check size={18} />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
