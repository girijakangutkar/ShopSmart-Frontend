import axios from "axios";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { PenNib } from "@phosphor-icons/react";

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

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
      const response = await axios.get(
        `http://localhost:3000/api/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
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
        `http://localhost:3000/myInfo/updateProfile/${userId}`,
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
    <div className="flex flex justify-center items-center align-center self-center text-center mt-[5%]">
      {userProfile && (
        <div>
          <img
            src={userProfile.profilePhoto}
            className="rounded-[50%] mt-2"
            alt="User profile"
          />
          <h1 className="font-bold text-xl mt-3">{userProfile.name}</h1>
          {isEditing ? (
            <div>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePhoto(e.target.files[0])}
                className="mt-2"
              />
              <button onClick={handleProfileUpdate}>Save</button>
              <button onClick={() => setEditing(false)}>Cancel</button>
            </div>
          ) : (
            <div className="flex justify-center items-center text-center self-center align-center mt-[4%] text-green-600 font-bold text-md ">
              <button
                onClick={() => setEditing(true)}
                className="flex gap-2 items-center border-2 border-green-600 p-1 rounded bg-green-200"
              >
                <PenNib size={17} /> Edit
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
