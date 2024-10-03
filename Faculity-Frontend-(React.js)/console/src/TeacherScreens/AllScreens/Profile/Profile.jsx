import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout as reduxLogout } from "../../../store/authSlice";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../store/AuthContext";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { TopNavigationBar } from "../../../../components/TopNavigationBar";
import axios from "axios";
import "./Profile.css";

export const TeacherProfile = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const teacherId = useSelector((state) => state.auth.teacherId);
  const [admin, setAdmin] = useState({});
  const [phoneNo, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logout: authLogout, userType } = useAuth();

  const fetchTeacherInfo = async () => {
    if (teacherId) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/teachers/get/${teacherId}`
        );
        setAdmin(response.data);
        setPhoneNo(response.data.Phoneno);
        setEmail(response.data.Email);
      } catch (error) {
        console.error("Error fetching teacher information:", error);
      }
    }
  };

  const fetchProfilePicture = async () => {
    if (teacherId) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/profile/getprofilepicture/${teacherId}`,
          {
            responseType: "arraybuffer",
          }
        );
        const base64Image = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        setProfilePicture(
          `data:${response.headers["content-type"]};base64,${base64Image}`
        );
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    }
  };

  useEffect(() => {
    fetchTeacherInfo();
    fetchProfilePicture();
  }, [teacherId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const uploadProfilePicture = async () => {
    if (selectedImage && teacherId) {
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("userId", teacherId);

      try {
        const response = await axios.post(
          "http://localhost:3000/api/profile/uploadprofile",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          setUploadStatus("Image uploaded.");
          setSelectedImage(null);
          fetchProfilePicture(); // Fetch the updated profile picture
        } else {
          setUploadStatus("Upload failed.");
        }
      } catch (error) {
        setUploadStatus("Upload failed.");
        console.error("Error uploading profile picture:", error);
      }
    } else {
      setUploadStatus("No image selected to upload.");
    }
  };

  const handleLogout = () => {
    dispatch(reduxLogout());
    authLogout();
    navigate(userType === "admin" ? "/" : "/", { replace: true });
  };

  const handleSaveChanges = async () => {
    const phoneNumberRegex = /^03[0-9]{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!phoneNumberRegex.test(phoneNo)) {
      alert("Please Enter Correct Cell No.");
    } else if (!emailRegex.test(email)) {
      alert("Please Enter Correct Email Address");
    } else {
      try {
        const updatedUser = {
          Phoneno: phoneNo,
          Email: email,
        };
        await axios.put(
          `http://localhost:3000/api/teachers/updateTeacherProfile/${teacherId}`,
          updatedUser
        );
        setAdmin((prevAdmin) => ({
          ...prevAdmin,
          Phoneno: phoneNo,
          Email: email,
        }));
        alert("Changes saved");
      } catch (error) {
        console.error("Changes failed:", error);
        alert("Update failed. Please try again.");
      }
    }
  };

  const handleUpdatePassword = async () => {
    if (oldPassword === "" || newPassword === "" || confirmNewPassword === "") {
      alert("Please enter details in all three sections.");
    } else if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long.");
    } else if (!/\d/.test(newPassword)) {
      alert("Password must contain at least one number.");
    } else if (!/[a-zA-Z]/.test(newPassword)) {
      alert("Password must contain at least one English alphabet.");
    } else if (newPassword !== confirmNewPassword) {
      alert("New Password does not match.");
    } else {
      try {
        const updatedUser = { password: newPassword, oldPassword };
        await axios.put(
          `http://localhost:3000/api/teachers/updateTeacherProfile/${teacherId}`,
          updatedUser
        );
        alert("Password updated successfully.");
      } catch (error) {
        console.error("Password update failed:", error);
        alert("Update failed. Please try again.");
      }
    }
  };

  return (
    <div>
      <TopNavigationBar value={false} />
      <div className="LogoutButtonContainer">
        <button className="LogoutBtn" onClick={handleLogout}>
          <CiLogout color="red" size={24} />
          <p>Logout</p>
        </button>
      </div>
      <div className="ProfileContainer">
        <div className="ProfileFormContainer1">
          <h2 className="ProfileHeading">Teacher Profile</h2>
          <div className="profilePictureButtonImageWrapper1">
            {profilePicture ? (
              <img
                className="ProfileImage1"
                src={profilePicture}
                alt="Profile"
              />
            ) : (
              <div className="ProfileImage1"  />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              id="profileImageInput"
            />
            <button
              className="ProfileChangeButton1"
              onClick={() =>
                document.getElementById("profileImageInput").click()
              }
            >
              <MdOutlineAddPhotoAlternate color="black" size={20} />
            </button>
          </div>
          {selectedImage && (
            <button className="ProfileButton1" onClick={uploadProfilePicture}>
              Upload New Profile Picture
            </button>
          )}
          <p>{uploadStatus}</p>
          <h2>{admin.fullName}</h2>
          <div className="ProfileLabelInputWrapper1">
            <label htmlFor="">Phone No:</label>
            <input
              type="text"
              placeholder="Update Phone No."
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              className="ProfileInputField"
            />
          </div>
          <div className="ProfileLabelInputWrapper1">
            <label htmlFor="">Email:</label>
            <input
              type="email"
              placeholder="Update Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="ProfileInputField"
            />
          </div>
          <button className="ProfileButton1" onClick={handleSaveChanges}>
            Save Changes
          </button>
          <div className="ProfileLabelInputWrapper1">
            <label htmlFor="">Old Password:</label>
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="ProfileInputField"
            />
          </div>
          <div className="ProfileLabelInputWrapper1">
            <label htmlFor="">New Password:</label>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="ProfileInputField"
            />
          </div>
          <div className="ProfileLabelInputWrapper1">
            <label htmlFor="">Confirm New Password:</label>
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="ProfileInputField"
            />
          </div>
          <button className="ProfileButton1" onClick={handleUpdatePassword}>
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};
