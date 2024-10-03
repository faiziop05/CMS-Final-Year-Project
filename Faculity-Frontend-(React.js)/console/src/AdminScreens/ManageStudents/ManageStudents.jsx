import React, { useState, useEffect } from "react";
import axios from "axios";
import { TopNavigationBar } from "../../../components/TopNavigationBar";
import "./ManageStudents.css";
import { useLocation } from "react-router-dom";

export const ManageStudents = () => {
  const [isAddStudentSelected, setIsAddStudentSelected] = useState(false);
  const [isUpdateStudentSelected, setIsUpdateStudentSelected] = useState(false);
  const [session, setSession] = useState("");
  const [program, setProgram] = useState("");
  const [programSemesters, setProgramSemesters] = useState("");
  const [Registeredsession, setRegisteredSession] = useState("");
  const [Registeredprogram, setRegisteredProgram] = useState("");
  const [startingRollNo, setStartingRollNo] = useState(1); // Starting roll number
  const [studentsData, setStudentsData] = useState([]);
  const [errors, setErrors] = useState({});
  const [studentList, setStudentList] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);
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
  const fetchStudentList = async () => {
    if(Registeredsession && Registeredprogram){

      try {
        const response = await axios.post("http://localhost:3000/api/students/program",
          {session:Registeredsession,program:Registeredprogram});
        setStudentList(response.data);
      } catch (error) {
        console.error("Error fetching student list:", error);
      }
    }
  };

  useEffect(() => {
    fetchStudentList();
  }, [Registeredprogram,Registeredsession]);

  const getCurrentYear = () => new Date().getFullYear();
  const generateYearOptions = () => {
    const currentYear = getCurrentYear();
    return Array.from({ length: 10 }, (_, i) => currentYear + i);
  };

  const isValidPakistaniPhoneNumber = (phoneNumber) => {
    const regex = /^(?:\+92|0)?3[0-9]{2}[0-9]{7}$/;
    return regex.test(phoneNumber);
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateInputs = () => {
    const newErrors = {};

    if (!session) {
      newErrors.session = "Session is required";
    }
    if (!program) {
      newErrors.program = "Program is required";
    }
    if (!programSemesters) {
      newErrors.programSemesters = "Program Semesters are required";
    }

    studentsData.forEach((student, index) => {
      if (!student.fullName) {
        newErrors[`fullName_${index}`] = "Full Name is required";
      }
      if (!student.phoneNo || !isValidPakistaniPhoneNumber(student.phoneNo)) {
        newErrors[`phoneNo_${index}`] =
          "Valid 11 digit phone number is required";
      }
      if (!student.email || !isValidEmail(student.email)) {
        newErrors[`email_${index}`] = "Valid email is required";
      }
      if (!student.homeAddress) {
        newErrors[`homeAddress_${index}`] = "Home Address is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatRollNo = (rollNo) => {
    return rollNo.toString().padStart(3, "0");
  };

  const generateUsername = (rollNo) => {
    const sessionYear = session.substring(2); // Assuming session is in the format "2020" -> "20"
    return `FA${sessionYear}-${program}-${formatRollNo(rollNo)}`;
  };

  const handleAddStudent = () => {
    const newStudent = {
      fullName: "",
      phoneNo: "",
      email: "",
      homeAddress: "",
      username: generateUsername(startingRollNo + studentsData.length),
      password: "must@125", // Change this to the desired default password
    };
    setStudentsData([...studentsData, newStudent]);
  };

  const handleInputChange = (index, field, value) => {
    const newStudentsData = [...studentsData];
    newStudentsData[index][field] = value;
    if (field === "fullName") {
      newStudentsData[index].username = generateUsername(
        startingRollNo + index
      );
    }
    setStudentsData(newStudentsData);
  };

  const handleEnrollStudents = async () => {
    if (validateInputs()) {
      try {
        const studentsToEnroll = {
          session,
          program,
          programSemesters,
          registeredStudents: studentsData.map((student, index) => ({
            ...student,
            rollNo: `${generateUsername(startingRollNo + index)}`,
          })),
        };
        await axios.post(
          "http://localhost:3000/api/students/batch",
          studentsToEnroll
        );
        alert("Student Enrolled Successfully!!!");
        fetchStudentList();
        setIsAddStudentSelected(false);
      } catch (error) {
        console.error("Error enrolling students:", error);
      }
    } else {
      alert("Please fix the errors before submitting.");
    }
  };

  const handleEdit = (student) => {
    setCurrentStudent(student);
    setIsUpdateStudentSelected(true);
  };

  const handleUpdateStudentInputChange = (field, value) => {
    setCurrentStudent({ ...currentStudent, [field]: value });
  };

  const handleUpdateStudent = async () => {
    if (currentStudent) {
      try {
        await axios.put(
          `http://localhost:3000/api/students/students/${currentStudent._id}`,
          currentStudent
        );
        alert("Student updated Successfully!!!");
        fetchStudentList();
        setIsUpdateStudentSelected(false);
        setCurrentStudent(null);
      } catch (error) {
        console.error("Error updating student:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/students/students/${id}`);
      alert("Student deleted Successfully!!!");
      fetchStudentList();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <div>
      <TopNavigationBar gotopath="CoordinatorProfile" />
      <div className="StudentTopButtons">
        <h2>Enroll Students</h2>
        <button
          onClick={() => {
            setIsAddStudentSelected(true);
            setErrors({});
            setStudentsData([]);
          }}
        >
          Click here to Enroll New Students
        </button>
      </div>
      {isAddStudentSelected && (
        <div className="EnrollStudentsContainer">
          <div className="CommonAttributes">
            <select
              value={session}
              className="ManageStudentOptionInputs"
              onChange={(e) => setSession(e.target.value)}
            >
              <option value="">Select Session</option>
              {generateYearOptions().map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.session && <p className="error">{errors.session}</p>}
            <select
              value={program}
              className="ManageStudentOptionInputs"
              onChange={(e) => setProgram(e.target.value)}
            >
              <option value="">Select Program</option>
              {user?.assignedDepartments?.map((item, index) => {
                return (
                  <option key={index} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
            {errors.program && <p className="error">{errors.program}</p>}
            <select
              value={programSemesters}
              className="ManageStudentOptionInputs"
              onChange={(e) => setProgramSemesters(e.target.value)}
            >
              <option value="">Select No. of semesters</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
            {errors.programSemesters && (
              <p className="error">{errors.programSemesters}</p>
            )}
            <input
              placeholder="Starting Roll Number"
              type="number"
              value={startingRollNo}
              className="ManageStudentInputs"
              onChange={(e) => setStartingRollNo(Number(e.target.value))}
            />
            {errors.startingRollNo && (
              <p className="error">{errors.startingRollNo}</p>
            )}
            <button className="AddStudentButton" onClick={handleAddStudent}>
              Add Student
            </button>
          </div>
          {studentsData.map((student, index) => (
            <div key={index} className="StudentDetailsWrapper">
              <h3>{index + 1}.</h3>
              <div className="StudentDetails">
                <div className="usernamePaswwordContienr">
                  <label>Full Name:</label>
                  <input
                    placeholder="Full Name"
                    type="text"
                    value={student.fullName}
                    className="ManageStudentInputs"
                    onChange={(e) =>
                      handleInputChange(index, "fullName", e.target.value)
                    }
                  />
                  {errors[`fullName_${index}`] && (
                    <p className="error">{errors[`fullName_${index}`]}</p>
                  )}
                </div>
                <div className="usernamePaswwordContienr">
                  <label>Phone No:</label>
                  <input
                    placeholder="Phone No."
                    type="text"
                    value={student.phoneNo}
                    className="ManageStudentInputs"
                    onChange={(e) =>
                      handleInputChange(index, "phoneNo", e.target.value)
                    }
                  />
                  {errors[`phoneNo_${index}`] && (
                    <p className="error">{errors[`phoneNo_${index}`]}</p>
                  )}
                </div>
                <div className="usernamePaswwordContienr">
                  <label>Email:</label>
                  <input
                    placeholder="Email"
                    type="text"
                    className="ManageStudentInputs"
                    value={student.email}
                    onChange={(e) =>
                      handleInputChange(index, "email", e.target.value)
                    }
                  />
                  {errors[`email_${index}`] && (
                    <p className="error">{errors[`email_${index}`]}</p>
                  )}
                </div>
                <div className="usernamePaswwordContienr">
                  <label>Home Address:</label>
                  <input
                    placeholder="Home Address"
                    type="text"
                    className="ManageStudentInputs"
                    value={student.homeAddress}
                    onChange={(e) =>
                      handleInputChange(index, "homeAddress", e.target.value)
                    }
                  />
                  {errors[`homeAddress_${index}`] && (
                    <p className="error">{errors[`homeAddress_${index}`]}</p>
                  )}
                </div>
                <div className="usernamePaswwordContienr">
                  <label>Username:</label>
                  <input
                    placeholder="Username"
                    type="text"
                    className="ManageStudentInputs"
                    value={student.username}
                    readOnly
                  />
                </div>
                <div className="usernamePaswwordContienr">
                  <label>Password:</label>
                  <input
                    placeholder="Password"
                    className="ManageStudentInputs"
                    value={student.password}
                    readOnly
                  />
                </div>
              </div>
            </div>
          ))}
          <button className="AddStudentButton" onClick={handleEnrollStudents}>
            Enroll Students
          </button>
        </div>
      )}
      {isUpdateStudentSelected && currentStudent && (
        <div className="UpdateStudentContainer">
          <h2 style={{ textAlign: "center" }}>Update Student</h2>
          <div className="StudentDetailsWrapper">
            <div className="StudentDetails">
              <div className="usernamePaswwordContienr">
                <label>Full Name:</label>
                <input
                  placeholder="Full Name"
                  type="text"
                  value={currentStudent.fullName}
                  className="ManageStudentInputs"
                  onChange={(e) =>
                    handleUpdateStudentInputChange("fullName", e.target.value)
                  }
                />
              </div>
              <div className="usernamePaswwordContienr">
                <label>Phone No:</label>
                <input
                  placeholder="Phone No."
                  type="text"
                  value={currentStudent.phoneNo}
                  className="ManageStudentInputs"
                  onChange={(e) =>
                    handleUpdateStudentInputChange("phoneNo", e.target.value)
                  }
                />
              </div>
              <div className="usernamePaswwordContienr">
                <label>Email:</label>
                <input
                  placeholder="Email"
                  type="text"
                  className="ManageStudentInputs"
                  value={currentStudent.email}
                  onChange={(e) =>
                    handleUpdateStudentInputChange("email", e.target.value)
                  }
                />
              </div>
              <div className="usernamePaswwordContienr">
                <label>Home Address:</label>
                <input
                  placeholder="Home Address"
                  type="text"
                  className="ManageStudentInputs"
                  value={currentStudent.homeAddress}
                  onChange={(e) =>
                    handleUpdateStudentInputChange(
                      "homeAddress",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="usernamePaswwordContienr">
                <label>Username:</label>
                <input
                  placeholder="Username"
                  type="text"
                  className="ManageStudentInputs"
                  value={currentStudent.username}
                  readOnly
                />
              </div>
              <div className="usernamePaswwordContienr">
                <label>Password:</label>
                <input
                  placeholder="Password"
                  className="ManageStudentInputs"
                  value={currentStudent.password}
                  readOnly
                />
              </div>
            </div>
          </div>
          <button
            style={{ marginLeft: "45%" }}
            className="AddStudentButton"
            onClick={handleUpdateStudent}
          >
            Update Student
          </button>
        </div>
      )}
      <div className="StudentsListContainerWrapper">
        <h2>Registered Students List</h2>
        <div>
          <select
            className="ManageStudentOptionInputs"
            value={Registeredsession}
            onChange={(e) => setRegisteredSession(e.target.value)}
          >
            <option value="">Select Session</option>
            {generateYearOptions().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            className="ManageStudentOptionInputs"
            value={Registeredprogram}
            onChange={(e) => setRegisteredProgram(e.target.value)}
          >
            <option value="">Select Program</option>
            {user?.assignedDepartments?.map((item, index) => {
              return (
                <option key={index} value={item}>
                  {item}
                </option>
              );
            })}
          </select>
        </div>
        {studentList
          .filter(
            (student) =>
              student.session === Registeredsession &&
              student.program === Registeredprogram
          )
          .map((item,index) => (
            <div className="StudentsListContainer" key={item._id}>
              <div className="StudentsListDetailsContainer">
                <p>
                  <strong>Full Name: </strong>
                  {item.fullName}
                </p>
                <p>
                  <strong>Roll No: </strong>
                  {item.username}
                </p>
                {expandedIndex === index && (
                  <>
                    <p>
                      <strong>Session: </strong>
                      {item.session}
                    </p>
                    <p>
                      <strong>Program: </strong>
                      {item.program}
                    </p>
                    <p>
                      <strong>Current Semester: </strong>
                      {item.semester}
                    </p>
                    <p>
                      <strong>Total Semesters: </strong>
                      {item.programSemesters}
                    </p>
                    <p>
                      <strong>Contact Number: </strong>
                      {item.phoneNo}
                    </p>
                    <p>
                      <strong>Email Address: </strong>
                      {item.email}
                    </p>
                    <p>
                      <strong>Home Address: </strong>
                      {item.homeAddress}
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
                        onClick={() => handleEdit(item)}
                        className="RegisteredCoordinatorsUpdateButton"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="RegisteredCoordinatorsDeleteButton"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
            </div>
          ))}
      </div>
    </div>
  );
};
