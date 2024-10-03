import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import "./Assignment.css";
import { TopNavigationBar } from "../../../../components/TopNavigationBar";
import axios from "axios";

const fetchAssignments = async (requestBody) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/assignment/getAssignmentDetails1",
      requestBody
    );
    const data = await response.data;
    return data;
  } catch (error) {
    console.error("Error fetching assignments:", error);
  }
};

const fetchCompletedAssignments = async (requestBody) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/assignment/getCompletedAssignmentDetails",
      requestBody
    );
    const data = await response.data;
    return data;
  } catch (error) {
    console.error("Error fetching completed assignments:", error);
  }
};

const deleteAssignment = async (id) => {
  console.log(id);
  try {
    const response = await axios.delete(
      `http://localhost:3000/api/assignment/deleteAssignment/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting assignment:", error);
  }
};

const fetchAssignmentFile = async (id) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/assignment/getAssignmentFile1",
      { id }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching assignment file:", error);
  }
};

const fetchCompletedAssignmentFile = async (id) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/assignment/getCompletedAssignmentFile",
      { id }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching completed assignment file:", error);
  }
};

export const Assignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [currentAssignment, setCurrentAssignment] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const location = useLocation();
  const { students } = location.state || {};
  const [uploadedAssignments, setUploadedAssignments] = useState([]);
  const [completedAssignments, setCompletedAssignments] = useState([]);
  const courseId = useSelector((state) => state.auth.courseId);
  const session = students?.[0]?.session;
  const program = students?.[0]?.program;
  const semester = students?.[0]?.semester;

  const fetchcassData = async () => {
    const requestBody = { program, session, courseId, semester };
    const data = await fetchAssignments(requestBody);
    setUploadedAssignments(data);
  };
  useEffect(() => {
    if (!session || !program || !courseId || !semester) {
      return;
    }

    fetchcassData();
  }, [courseId, program, session, semester]);

  const fetchassData = async () => {
    const requestBody = { program, session, courseId, semester };
    const data = await fetchCompletedAssignments(requestBody);
    setCompletedAssignments(data);
  };

  useEffect(() => {
    if (!session || !program || !courseId || !semester) {
      return;
    }

    fetchassData();
  }, [courseId, program, session, semester]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAssignment({ ...currentAssignment, [name]: value });
  };

  const validateInputs = () => {
    let valid = true;
    let newErrors = {};

    if (!currentAssignment.title.trim()) {
      newErrors.title = "Title is required";
      valid = false;
    }
    if (!currentAssignment.description.trim()) {
      newErrors.description = "Description is required";
      valid = false;
    }
    if (!currentAssignment.deadline) {
      newErrors.deadline = "Deadline is required";
      valid = false;
    } else {
      const deadlineDate = new Date(currentAssignment.deadline);
      if (isNaN(deadlineDate.getTime())) {
        newErrors.deadline = "Invalid date format";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleAddUpdateAssignment = () => {
    if (!validateInputs()) return;

    if (editingIndex !== null) {
      const updatedAssignments = assignments.map((item, index) =>
        index === editingIndex ? currentAssignment : item
      );
      setAssignments(updatedAssignments);
      setEditingIndex(null);
    } else {
      setAssignments([
        ...assignments,
        { ...currentAssignment, uploadedFile: null },
      ]);
    }
    setCurrentAssignment({ title: "", description: "", deadline: "" });
  };

  const handleEditAssignment = (index) => {
    setCurrentAssignment(assignments[index]);
    setEditingIndex(index);
  };

  const handleDeleteAssignment = (index) => {
    const updatedAssignments = assignments.filter((_, i) => i !== index);
    setAssignments(updatedAssignments);
  };

  const handleFileUpload = (e, index) => {
    const file = e.target.files[0];
    const updatedAssignments = assignments.map((item, i) =>
      i === index ? { ...item, uploadedFile: file } : item
    );
    setAssignments(updatedAssignments);
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUploadToServer = async (index) => {
    const assignment = assignments[index];
    if (!assignment.uploadedFile) {
      alert("Please choose a file to upload");
      return;
    }

    try {
      const base64File = await getBase64(assignment.uploadedFile);

      const data = {
        title: assignment.title,
        description: assignment.description,
        deadline: assignment.deadline,
        courseId: courseId,
        session: students[0]?.session,
        program: students[0]?.program,
        semester: students[0]?.semester,
        fileData: base64File.split(",")[1],
        fileName: assignment.uploadedFile.name,
        mimeType: assignment.uploadedFile.type,
        status: "Pending",
      };

      const response = await axios.post(
        "http://localhost:3000/api/assignment/uploadAssignment",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("File uploaded successfully.");
        await fetchassData()
        await fetchcassData()
      } else {
        alert(`Failed to upload file: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error uploading assignment:", error);
      alert("Error uploading assignment");
    }
  };

  const triggerFileInput = (inputId) => {
    document.getElementById(inputId).click();
  };

  const handleDownloadFile = async (id, isCompleted) => {
    try {
      const fetchFunction = isCompleted
        ? fetchCompletedAssignmentFile
        : fetchAssignmentFile;
      const assignmentFile = await fetchFunction(id);
      const link = document.createElement("a");
      link.href = `data:${assignmentFile.mimeType};base64,${assignmentFile.fileData}`;
      link.download = assignmentFile.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Error downloading file");
    }
  };

  const handleDeleteUploadedAssignment = async (id) => {
    try {
      await deleteAssignment(id);
      setUploadedAssignments(
        uploadedAssignments.filter((item) => item._id !== id)
      );
      alert("Assignment deleted successfully");
      await fetchassData()
      await fetchcassData()
    } catch (error) {
      console.error("Error deleting assignment:", error);
      alert("Error deleting assignment");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!students || students.length === 0) {
    return (
      <div>
        <TopNavigationBar gotopath="TeacherProfile" />
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          No registered students.
        </p>
      </div>
    );
  }

  return (
    <div>
      <TopNavigationBar gotopath="TeacherProfile" />
      <div className="AssignmentContainer">
        <h2 className="center-text">Add Assignment</h2>
        <div className="form-container">
          <input
            type="text"
            name="title"
            value={currentAssignment.title}
            onChange={handleInputChange}
            placeholder="Assignment Title"
            className="input-field"
          />
          {errors.title && <p className="error">{errors.title}</p>}
          <textarea
            name="description"
            value={currentAssignment.description}
            onChange={handleInputChange}
            placeholder="Assignment Description"
            className="input-field"
          />
          {errors.description && <p className="error">{errors.description}</p>}
          <input
            type="date"
            name="deadline"
            value={currentAssignment.deadline}
            onChange={handleInputChange}
            className="input-field"
          />
          {errors.deadline && <p className="error">{errors.deadline}</p>}
          <button onClick={handleAddUpdateAssignment} className="btn">
            {editingIndex !== null ? "Update Assignment" : "Add Assignment"}
          </button>
        </div>
        <div className="assignments-list">
          <ul className="assignment-items">
            {assignments.map((item, index) => (
              <div key={index}>
                <h3 className="center-text">Assignment List</h3>
                <li className="assignment-item">
                  <div className="assignment-item-content">
                    <p>
                      <strong>Title: </strong> {item.title}
                    </p>
                    <p>
                      <strong>Description: </strong> {item.description}
                    </p>
                    <p>
                      <strong>Deadline: </strong> {item.deadline}
                    </p>
                  </div>
                  <div className="assignment-item-actions">
                    <div>
                      <button
                        onClick={() => handleEditAssignment(index)}
                        className="btn-small"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAssignment(index)}
                        className="btn-small"
                      >
                        Delete
                      </button>
                    </div>
                    <div>
                      <input
                        type="file"
                        id={`completed-file-input-${index}`}
                        onChange={(e) => handleFileUpload(e, index)}
                        className="file-input"
                      />
                      <button
                        onClick={() =>
                          triggerFileInput(`completed-file-input-${index}`)
                        }
                        className="custom-file-button"
                      >
                        Choose File
                      </button>
                      <button
                        onClick={() => handleUploadToServer(index)}
                        className="custom-file-button"
                      >
                        Upload
                      </button>
                      {item.uploadedFile && (
                        <a
                          href={URL.createObjectURL(item.uploadedFile)}
                          download={item.uploadedFile.name}
                          className="download-link"
                        >
                          Download {item.uploadedFile.name}
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              </div>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="UploadedAssignmentsHeading">Uploaded Assignments</h2>
          <div>
            {uploadedAssignments?.length > 0 ? (
              uploadedAssignments.map((item) => (
                <div className="uploadedAssignmentWrapper" key={item._id}>
                  <div>
                    <p>
                      <strong>Title: </strong>
                      {item.title}
                    </p>
                    <p>
                      <strong>Description: </strong>
                      {item.description}
                    </p>
                    <p>
                      <strong>Upload date: </strong>
                      {formatDate(item.uploadDate)}
                    </p>
                    <p>
                      <strong>Deadline: </strong>
                      {formatDate(item.deadline)}
                    </p>
                  </div>
                  <div>
                    <a
                      onClick={() => handleDownloadFile(item._id, false)}
                      className="download-link"
                    >
                      Download
                    </a>
                    <button
                      className="deleteUploadedassignmetn"
                      onClick={() => handleDeleteUploadedAssignment(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center" }}>
                No assignments uploaded yet.
              </p>
            )}
          </div>
        </div>
        <div>
          <h2 className="UploadedAssignmentsHeading">
            Student Completed Assignments
          </h2>
          <div>
            {completedAssignments?.length > 0 ? (
              completedAssignments.map((item) => (
                <div className="uploadedAssignmentWrapper" key={item._id}>
                  <div>
                    <p>
                      <strong>Roll No: </strong>
                      {item.rollNo}
                    </p>
                    <p>
                      <strong>Upload Date: </strong>
                      {formatDate(item.uploadDate)}
                    </p>
                  </div>
                  <a
                    onClick={() => handleDownloadFile(item._id, true)}
                    className="download-link"
                  >
                    Download
                  </a>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center" }}>
                No completed assignments uploaded yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
