import "./ManageCoordinators.css";
import { TopNavigationBar } from "../../../components/TopNavigationBar";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { programOptions } from "../../../ProgramList";

export const ManageCoordinators = () => {
  const [isAddCoordinatorSelected, setIsAddCoordinatorSelected] =
    useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCoordinatorIndex, setSelectedCoordinatorIndex] =
    useState(null);
  const [AddCoordinator, setAddCoordinator] = useState({
    fullName: "",
    Phoneno: "",
    Email: "",
    HomeAddress: "",
    assignedDepartments: [],
    username: "",
    password: "",
    id: "",
  });
  const [coordinatorList, setCoordinatorList] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const fetchCoordinatorList = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/api/CoordinatorRoutes"
      );
      setCoordinatorList(response.data);
    } catch (error) {
      console.error("Error fetching coordinator list:", error);
    }
    setIsLoading(false);
  };
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
  useEffect(() => {
    fetchCoordinatorList();
  }, []);
  const toggleShowMore = (index, id) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
      setProfilePicture(null)
    } else {
      setExpandedIndex(index);
      fetchProfilePicture(id);
    }
  };
  const validateInputs = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+92|0)?3[0-9]{9}$/;

    if (!AddCoordinator.fullName) {
      newErrors.fullName = "Full name is required.";
    }

    if (!AddCoordinator.Phoneno) {
      newErrors.Phoneno = "Phone number is required.";
    } else if (!phoneRegex.test(AddCoordinator.Phoneno)) {
      newErrors.Phoneno =
        "Invalid phone number. It should be a valid 11 digit number.";
    }

    if (!AddCoordinator.Email) {
      newErrors.Email = "Email is required.";
    } else if (!emailRegex.test(AddCoordinator.Email)) {
      newErrors.Email = "Invalid email address.";
    }

    if (!AddCoordinator.HomeAddress) {
      newErrors.HomeAddress = "Home address is required.";
    }

    if (AddCoordinator.assignedDepartments.length === 0) {
      newErrors.assignedDepartments =
        "At least one department must be selected.";
    }

    if (!AddCoordinator.username) {
      newErrors.username = "Username is required.";
    }

    if (!AddCoordinator.password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCoordinator = async () => {
    if (validateInputs()) {
      try {
        const coordinatorToUpdate = { ...AddCoordinator };

        if (isEditMode) {
          if (
            selectedCoordinatorIndex >= 0 &&
            selectedCoordinatorIndex < coordinatorList.length
          ) {
            const coordinatorToUpdateId =
              coordinatorList[selectedCoordinatorIndex]._id;
            await axios.put(
              `http://localhost:3000/api/CoordinatorRoutes/${coordinatorToUpdateId}`,
              coordinatorToUpdate
            );
          } else {
            console.error("Invalid coordinator index for update");
            return;
          }
        } else {
          await axios.post(
            "http://localhost:3000/api/CoordinatorRoutes",
            coordinatorToUpdate
          );
        }
        fetchCoordinatorList();
        setAddCoordinator({
          fullName: "",
          Phoneno: "",
          Email: "",
          HomeAddress: "",
          assignedDepartments: [],
          username: "",
          password: "",
          id: "",
        });
        setIsAddCoordinatorSelected(false);
      } catch (error) {
        console.error("Error saving coordinator:", error);
      }
    } else {
      alert("Please fix the errors before submitting.");
    }
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/CoordinatorRoutes/${coordinatorList[index]._id}`
      );
      fetchCoordinatorList();
    } catch (error) {
      console.error("Error deleting coordinator:", error);
    }
  };

  const handleUpdate = (index) => {
    setIsAddCoordinatorSelected(true);
    setIsEditMode(true);
    setSelectedCoordinatorIndex(index);
    if (index >= 0 && index < coordinatorList.length) {
      const selectedCoordinator = coordinatorList[index];
      setAddCoordinator({
        ...selectedCoordinator,
        id: selectedCoordinator._id,
      });
    } else {
      console.error("Invalid coordinator index for update");
    }
  };

  return (
    <div>
      <TopNavigationBar gotopath="AdminProfile" />
      <div className="CoordinatorTopButtons">
        <button
          onClick={() => {
            setIsAddCoordinatorSelected(true);
            setIsEditMode(false);
            setAddCoordinator({
              fullName: "",
              Phoneno: "",
              Email: "",
              HomeAddress: "",
              assignedDepartments: [],
              username: "",
              password: "",
              id: "",
            });
            setErrors({});
          }}
        >
          Add Coordinator
        </button>
      </div>
      {isAddCoordinatorSelected && (
        <div className="ManageCoordinatorInputsContainer">
          <h2>{isEditMode ? "Update Coordinator" : "Add Coordinator"}</h2>
          <div className="ManageCoordinatorInputsContainer">
            <input
              placeholder="Full Name"
              className="ManageCoordinatorInputs"
              type="text"
              value={AddCoordinator.fullName}
              onChange={(e) =>
                setAddCoordinator({
                  ...AddCoordinator,
                  fullName: e.target.value,
                })
              }
            />
            {errors.fullName && <p className="error">{errors.fullName}</p>}
            <input
              placeholder="Phone No."
              className="ManageCoordinatorInputs"
              type="text"
              value={AddCoordinator.Phoneno}
              onChange={(e) =>
                setAddCoordinator({
                  ...AddCoordinator,
                  Phoneno: e.target.value,
                })
              }
            />
            {errors.Phoneno && <p className="error">{errors.Phoneno}</p>}
            <input
              placeholder="Email Address"
              className="ManageCoordinatorInputs"
              type="text"
              value={AddCoordinator.Email}
              onChange={(e) =>
                setAddCoordinator({ ...AddCoordinator, Email: e.target.value })
              }
            />
            {errors.Email && <p className="error">{errors.Email}</p>}
            <input
              placeholder="Home Address"
              className="ManageCoordinatorInputs"
              type="text"
              value={AddCoordinator.HomeAddress}
              onChange={(e) =>
                setAddCoordinator({
                  ...AddCoordinator,
                  HomeAddress: e.target.value,
                })
              }
            />
            {errors.HomeAddress && (
              <p className="error">{errors.HomeAddress}</p>
            )}
            <select
              className="ManageCoordinatorSelectlist2"
              name="Position"
              id="Position"
              multiple
              value={AddCoordinator.assignedDepartments}
              onChange={(e) =>
                setAddCoordinator({
                  ...AddCoordinator,
                  assignedDepartments: Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  ),
                })
              }
            >
              <option
                style={{
                  color: "orange",
                  letterSpacing: 1,
                  fontWeight: "bold",
                }}
                value=""
              >
                Select Department
              </option>
              {programOptions.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            {errors.assignedDepartments && (
              <p className="error">{errors.assignedDepartments}</p>
            )}
            <input
              placeholder="Username"
              className="ManageCoordinatorInputs"
              type="text"
              value={AddCoordinator.username}
              onChange={(e) =>
                setAddCoordinator({
                  ...AddCoordinator,
                  username: e.target.value,
                })
              }
            />
            {errors.username && <p className="error">{errors.username}</p>}
            <input
              placeholder="Password"
              className="ManageCoordinatorInputs"
              type="password"
              value={AddCoordinator.password}
              onChange={(e) =>
                setAddCoordinator({
                  ...AddCoordinator,
                  password: e.target.value,
                })
              }
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <button
            className="AddCoordinatorButton"
            onClick={handleAddCoordinator}
          >
            {isEditMode ? "Update Coordinator" : "Add Coordinator"}
          </button>
        </div>
      )}
      <div className="CoordinatorsListContainerWrapper">
        <h2>Registered Coordinators List</h2>
        {isLoading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : (
          coordinatorList.map((item, index) => {
            return (
              <div className="CoordinatorsListContainer" key={index}>
                <div className="CoordinatorsListDetailsContainer">
                  <p>
                    <strong>Full Name: </strong>
                    {item.fullName}
                  </p>
                  <p>
                    <strong>Departments: </strong>
                    {item?.assignedDepartments?.join(", ")}
                  </p>
                  {expandedIndex === index && (
                    <>
                      <p>
                        <strong>Contact Number: </strong>
                        {item.Phoneno}
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
            );
          })
        )}
      </div>
    </div>
  );
};

export default ManageCoordinators;
