import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageTeachers.css";
import { TopNavigationBar } from "../../../components/TopNavigationBar";
import { useLocation } from "react-router-dom";

export const ManageTeachers = () => {
  const [isAddTeacherSelected, setIsAddTeacherSelected] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTeacherIndex, setSelectedTeacherIndex] = useState(null);
  const [Addteacher, setAddTeacher] = useState({
    fullName: "",
    Phoneno: "",
    Email: "",
    HomeAddress: "",
    post: "",
    Assignedcourses: [],
    username: "",
    password: "",
    id: "", // Add teacher ID field
  });
  const [teacherList, setTeacherList] = useState([]);
  const [program, setProgram] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const location = useLocation();
  const { user } = location.state || {};

  const [profilePicture, setProfilePicture] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const fetchProfilePicture = async (id) => {
    if (id) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/profile/getprofilepicture/${id}`,
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
        setProfilePicture(null);
      }
    }
  };
  const toggleShowMore = (index, id) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
      setProfilePicture(null);
    } else {
      setProfilePicture(null)
      setExpandedIndex(index);
      fetchProfilePicture(id);
    }
  };

  const fetchTeacherList = async () => {
    if (program) {
      setIsLoading(true); // Set loading to true when fetching data
      try {
        const response = await axios.post(
          "http://localhost:3000/api/teachers/get",
          { program }
        );
        setTeacherList(response.data);
      } catch (error) {
        console.error("Error fetching teacher list:", error);
      }
      setIsLoading(false); // Set loading to false after data fetch
    }
  };

  useEffect(() => {
    fetchTeacherList();
  }, [program]);

  const validateInputs = () => {
    const newErrors = {};

    if (!Addteacher.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    const phonePattern = /^(\+92|0)?3[0-9]{9}$/;
    if (!Addteacher.Phoneno.trim()) {
      newErrors.Phoneno = "Phone number is required.";
    } else if (!phonePattern.test(Addteacher.Phoneno)) {
      newErrors.Phoneno = "Phone number is invalid.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!Addteacher.Email.trim()) {
      newErrors.Email = "Email is required.";
    } else if (!emailPattern.test(Addteacher.Email)) {
      newErrors.Email = "Email is invalid.";
    }

    if (!Addteacher.HomeAddress.trim()) {
      newErrors.HomeAddress = "Home address is required.";
    }

    if (!Addteacher.post.trim()) {
      newErrors.post = "Post is required.";
    }

    if (!Addteacher.username.trim()) {
      newErrors.username = "Username is required.";
    }

    if (!Addteacher.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (Addteacher.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddteacher = async () => {
    if (validateInputs()) {
      try {
        const teacherToUpdate = { ...Addteacher }; // Copy to avoid mutation

        if (isEditMode) {
          // Ensure valid teacher selected before update
          if (
            selectedTeacherIndex >= 0 &&
            selectedTeacherIndex < teacherList.length
          ) {
            const teacherToUpdateId = teacherList[selectedTeacherIndex]._id;
            await axios.put(
              `http://localhost:3000/api/teachers/${teacherToUpdateId}`,
              teacherToUpdate
            );
            alert("Teacher updated Successfully!!!");
            fetchTeacherList();
          } else {
            console.error("Invalid teacher index for update");
            return; // Handle invalid index gracefully (optional: show error message)
          }
        } else {
          await axios.post(
            "http://localhost:3000/api/teachers",
            teacherToUpdate
          );
          alert("Teacher Registered Successfully!!!");
          fetchTeacherList();
        }
        setAddTeacher({
          fullName: "",
          Phoneno: "",
          Email: "",
          HomeAddress: "",
          post: "",
          Assignedcourses: [],
          username: "",
          password: "",
          program: "",
          id: "", // Clear ID field after submission
        });
        setIsAddTeacherSelected(false);
      } catch (error) {
        console.error("Error saving teacher:", error);
      }
    } else {
      alert("Please fix the errors before submitting.");
    }
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/teachers/${teacherList[index]._id}`
      );
      alert("Teacher deleted Successfully!!!");
      fetchTeacherList();
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };

  const handleUpdate = (index) => {
    setIsAddTeacherSelected(true);
    setIsEditMode(true);
    setSelectedTeacherIndex(index);
    // Check if the selected teacher index is valid
    if (index >= 0 && index < teacherList.length) {
      // Update AddTeacher state with the selected teacher's data
      const selectedTeacher = teacherList[index];
      setAddTeacher({ ...selectedTeacher });
      // Adding ID field to Addteacher state
      setAddTeacher({
        ...selectedTeacher,
        id: selectedTeacher._id, // Assigning ID field from selected teacher
      });
    } else {
      console.error("Invalid teacher index for update");
    }
  };
  return (
    <div>
      <TopNavigationBar gotopath="CoordinatorProfile" />
      <div className="TeacherTopButtons">
        <button
          onClick={() => {
            setIsAddTeacherSelected(true);
            setIsEditMode(false);
            setAddTeacher({
              fullName: "",
              Phoneno: "",
              Email: "",
              HomeAddress: "",
              post: "",
              Assignedcourses: [],
              username: "",
              password: "",
              program: "",
              id: "", // Clear ID field when adding new teacher
            });
            setErrors({});
          }}
        >
          Add Teacher
        </button>
      </div>
      {isAddTeacherSelected && (
        <div className="ManageTeacherInputsContainer">
          <h2>{isEditMode ? "Update Teacher" : "Add Teacher"}</h2>
          <div className="ManageTeacherInputsContainer">
            <input
              placeholder="Full Name"
              className="ManageTeacherInputs"
              type="text"
              value={Addteacher.fullName}
              onChange={(e) =>
                setAddTeacher({ ...Addteacher, fullName: e.target.value })
              }
            />
            {errors.fullName && <p className="error">{errors.fullName}</p>}
            <input
              placeholder="Phone No."
              className="ManageTeacherInputs"
              type="text"
              value={Addteacher.Phoneno}
              onChange={(e) =>
                setAddTeacher({ ...Addteacher, Phoneno: e.target.value })
              }
            />
            {errors.Phoneno && <p className="error">{errors.Phoneno}</p>}
            <select
              className="ManageStudentOptionInputs2"
              value={Addteacher.program}
              onChange={(e) =>
                setAddTeacher({ ...Addteacher, program: e.target.value })
              }
            >
              <option value="">Select Program</option>
              {user.assignedDepartments.map((item, index) => {
                return (
                  <option key={index} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
            {errors.program && <p className="error">{errors.program}</p>}
            <input
              placeholder="Email Address"
              className="ManageTeacherInputs"
              type="text"
              value={Addteacher.Email}
              onChange={(e) =>
                setAddTeacher({ ...Addteacher, Email: e.target.value })
              }
            />
            {errors.Email && <p className="error">{errors.Email}</p>}
            <input
              placeholder="Home Address"
              className="ManageTeacherInputs"
              type="text"
              value={Addteacher.HomeAddress}
              onChange={(e) =>
                setAddTeacher({ ...Addteacher, HomeAddress: e.target.value })
              }
            />
            {errors.HomeAddress && (
              <p className="error">{errors.HomeAddress}</p>
            )}
            <select
              className="ManageTeacherSelectlist"
              name="Position"
              id="Position"
              value={Addteacher.post}
              onChange={(e) =>
                setAddTeacher({ ...Addteacher, post: e.target.value })
              }
            >
              <option value="">Select Post</option>
              <option value="Lecturer">Lecturer</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Professor">Professor</option>
            </select>
            {errors.post && <p className="error">{errors.post}</p>}
            <input
              placeholder="Username"
              className="ManageTeacherInputs"
              type="text"
              value={Addteacher.username}
              onChange={(e) =>
                setAddTeacher({ ...Addteacher, username: e.target.value })
              }
            />
            {errors.username && <p className="error">{errors.username}</p>}
            <input
              placeholder="Password"
              className="ManageTeacherInputs"
              type="password"
              value={Addteacher.password}
              onChange={(e) =>
                setAddTeacher({ ...Addteacher, password: e.target.value })
              }
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <button className="AddteacherButton" onClick={handleAddteacher}>
            {isEditMode ? "Update Teacher" : "Add Teacher"}
          </button>
        </div>
      )}
      <div className="TeachersListContainerWrapper">
        <h2>Registered Teachers List</h2>
        <select
          className="ManageStudentOptionInputs2"
          value={program}
          onChange={(e) => setProgram(e.target.value)}
        >
          <option value="">Select Program</option>
          {user.assignedDepartments.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
        {!program ? (
          <p style={{ textAlign: "center" }}>
            Please Select Program to show Registered Teachers
          </p>
        ) : (
          <>
            {isLoading ? (
              <p style={{ textAlign: "center" }}>Loading...</p>
            ) : (
              teacherList.map((item, index) => (
                <div className="TeachersListContainer" key={index}>
                  <div className="TeachersListDetailsContainer">
                    <p>
                      <strong>Full Name: </strong>
                      {item.fullName}
                    </p>
                    <p>
                      <strong>Post: </strong>
                      {item.post}
                    </p>
                    {expandedIndex === index && (
                      <>
                        <p>
                          <strong>Contact Number: </strong>
                          {item.Phoneno}
                        </p>
                        <p>
                          <strong>Program: </strong>
                          {item.program}
                        </p>
                        <p>
                          <strong>Email Address: </strong>
                          {item.Email}
                        </p>
                        <p>
                          <strong>Home Address: </strong>
                          {item.HomeAddress}
                        </p>
                        <p>
                          <strong>Username: </strong>
                          {item.username}
                        </p>
                        <p>
                          <strong>Password: </strong>
                          {item.password}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="manaagecoordwritecontienrwrapper">
                    {expandedIndex === index ? (
                      <>
                        {profilePicture ? (
                          <img
                            className="ProfileImage2"
                            src={profilePicture}
                            alt="Profile"
                          />
                        ) : (
                          <div className="ProfileImage2" />
                        )}
                      </>
                    ) : (
                      ""
                    )}
                    <div className="updatedeleteshowmorebuttonwrapper">
                      <button
                        onClick={() => toggleShowMore(index, item._id)}
                        className="RegisteredCoordinatorsShowMoreButton"
                      >
                        {expandedIndex === index
                          ? "Show Less"
                          : "Show More Details"}
                      </button>
                      <div className="RegisteredCoordinatorsButtonWrapper">
                        <button
                          onClick={() => handleUpdate(index)}
                          className="RegisteredCoordinatorsUpdateButton"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="RegisteredCoordinatorsDeleteButton"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ManageTeachers;
