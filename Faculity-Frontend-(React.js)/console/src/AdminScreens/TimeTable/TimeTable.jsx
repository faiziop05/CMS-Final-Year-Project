import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TimeTable.css";
import { TopNavigationBar } from "../../../components/TopNavigationBar";
import { useLocation } from "react-router-dom";

const fetchTimetableDetails = async (program) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/timetable/getTimetableDetails",
      { program }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching timetable details:", error);
    throw error;
  }
};

const fetchTimetableFile = async (id) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/timetable/getTimetableFile",
      { id }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching timetable file:", error);
    throw error;
  }
};

export const TimeTable = () => {
  const [selectedTimeTable, setSelectedTimeTable] = useState([]);
  const [program, setProgram] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const location = useLocation();
  const { user } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      if (program) {
        const data = await fetchTimetableDetails(program);
        setSelectedTimeTable(data);
      }
    };
    fetchData();
  }, [program]);

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const downloadDocument = async (id) => {
    try {
      const timetableFile = await fetchTimetableFile(id);
      const { fileData, fileName, mimeType } = timetableFile;
      const fileUrl = `data:${mimeType};base64,${fileData}`;
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error("Error downloading document:", error);
      alert("An error occurred while downloading the document.");
    }
  };

  const onUpload = async () => {
    if (!program && !title) {
      alert("Please select a program and title.");
      return;
    }
    if (!file) {
      alert("Please choose a file to upload.");
      return;
    }

    try {
      const base64File = await getBase64(file);

      const data = {
        program,
        title,
        fileData: base64File.split(",")[1],
        fileName: file.name,
        mimeType: file.type,
      };

      const response = await axios.post(
        "http://localhost:3000/api/timetable/upload",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("File uploaded successfully.");
        setSelectedTimeTable((prev) => [...prev, response.data]);
      } else {
        alert(`Failed to upload file: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
  };

  return (
    <div>
      <TopNavigationBar gotopath="CoordinatorProfile" />
      <div className="ClallanAllWrapper">
        <h2 className="TimeTableHeadings">
          Select and Upload TimeTable from Here
        </h2>
        <div className="SelectFileAllConatiner">
          <div className="FileUploadHeadingsInputWrapper">
            <label htmlFor="timetablechallansemster">Program:</label>
            <select
              className="ManageStudentOptionInputs"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
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
          </div>
          <div className="FileUploadHeadingsInputWrapper">
            <label htmlFor="timetabletitle">Title:</label>
            <input
              className="ManageStudentOptionInputs1"
              type="text"
              value={title}
              name="timetabletitle"
              id="timetabletitle"
              placeholder="Add Title"
              onChange={(e)=>setTitle(e.target.value)}
            />
          </div>
          <div className="FileUploadHeadingsInputWrapper">
            <label htmlFor="file-input" className="custom-file-label">
              Click here to Choose File
            </label>
            <input
              type="file"
              id="file-input"
              onChange={(e) => setFile(e.target.files[0])}
              hidden
            />
          </div>
          <button className="TimeTableFileUploadButton" onClick={onUpload}>
            Upload
          </button>
        </div>

        <h2 className="TimeTableHeadings">Upload History</h2>

        {selectedTimeTable.length > 0 ? (
          <>
            {selectedTimeTable.map((item, index) => (
              <div key={index} className="ChallanComponentWapper">
                <div>
                  <p>
                    <strong>Upload Date:</strong>{" "}
                    {new Date(item.uploadDate).toLocaleString()}
                  </p>
                  <p>
                    <strong>Title:</strong> {item.title}
                  </p>
                  <p>
                    <strong>File Name:</strong> {item.fileName}
                  </p>
                  <p>
                    <strong>Program:</strong> {item.program}
                  </p>
                </div>
                <button
                  onClick={() => downloadDocument(item._id)}
                  className="challanDownloadButton"
                >
                  Download
                </button>
              </div>
            ))}
          </>
        ) : (
          <p>Select program to see uploaded history</p>
        )}
      </div>
    </div>
  );
};
