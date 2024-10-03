import React, { useEffect, useState } from "react";
import "./MannageMarks.css";
import { TopNavigationBar } from "../../../../components/TopNavigationBar";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

export const MannageMarks = () => {
  const location = useLocation();
  const { students } = location.state || {};
  const [Totalmarks, setTotalMarks] = useState("");
  const [date, setDate] = useState("");
  const [MarksType, setMarksType] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [message, setMessage] = useState("");
  const [currentMarks, setCurrentMarks] = useState(
    students ? students.map(() => "") : []
  );
  const [uniqueMarksTypes, setUniqueMarksTypes] = useState([]);
  const courseId = useSelector((state) => state.auth.courseId);
  const teacherId = useSelector((state) => state.auth.teacherId);
  // Grouped by MarksType
  const [AllMarksData, setAllMarksData] = useState(
    students
      ? students.reduce((acc, student) => {
          acc[student.username] = {
            RegNum: student.username,
            StudentName: student.fullName,
            marksType: MarksType,
            Marks: student.Marks || {},
            session: student.session,
            program: student.program,
            studentId: student._id,
            courseId: courseId,
            TotalMarks: Totalmarks,
            Date:date,
            teacherId:teacherId
          };
          return acc;
        }, {})
      : {}
  );
  const [fetchedData, setFetchedData] = useState([]);

  useEffect(() => {
    fetchMarksData();
  }, [students, courseId]);
  if (!students || students.length === 0) {
    setMessage("No registered students.");
    return;
  }

  const fetchMarksData = async () => {
    const session = students[0]?.session;
    const program = students[0]?.program;
    const requestBody = { program, session, courseId };

    try {
      const res = await axios.post(
        "http://localhost:3000/api/marks/marks/get",
        requestBody
      );
      setFetchedData(res.data);
      // Extract unique marks types
      const types = Object.keys(res.data);
      setUniqueMarksTypes(types);

      // Initialize AllMarksData based on fetchedData
      const initialAllMarksData = students.reduce((acc, student) => {
        acc[student.username] = {
          RegNum: student.username,
          StudentName: student.fullName,
          marksType: "",
          Marks: "",
          session: student.session,
          program: student.program,
          studentId: student._id,
          courseId: courseId,
          Date:date,
          teacherId:teacherId
        };
        return acc;
      }, {});

      setAllMarksData(initialAllMarksData);
    } catch (error) {
      alert("Error fetching marks: " + error.message);
    }
  };

  const handleModifyClick = () => {
    if (selectedClass) {
      const selectedMarks = students.map((student) => {
        const marksData = fetchedData[selectedClass.marksType];
        return marksData && marksData[student.username] !== undefined
          ? marksData[student.username].Marks
          : "";
      });

      setCurrentMarks(selectedMarks);
      setIsUpdateMode(true);
    }
  };

  const handleSelectInputChange = (e) => {
    setMarksType(e.target.value);
  };

  const handleTextInputChange = (e, index) => {
    const newMarks = [...currentMarks];
    newMarks[index] = e.target.value;
    setCurrentMarks(newMarks);
  };

  const handleSubmit = async () => {
    if (Totalmarks !== "" && MarksType !== "" && currentMarks[0] !== "") {
      const updatedMarksData = { ...AllMarksData };

      students.forEach((student, index) => {
        if (!updatedMarksData[student.username]) {
          updatedMarksData[student.username] = {
            RegNum: student.username,
            StudentName: student.fullName,
            marksType: MarksType,
            Marks: currentMarks[index],
            session: student.session,
            program: student.program,
            studentId: student._id,
            courseId: courseId,
            TotalMarks: Totalmarks,
            Date:date,
            teacherId:teacherId
          };
        } else {
          updatedMarksData[student.username].marksType = MarksType;
          updatedMarksData[student.username].Marks = currentMarks[index];
          updatedMarksData[student.username].TotalMarks = Totalmarks;
          updatedMarksData[student.username].Date = date;
        }
      });

      setAllMarksData(updatedMarksData);

      // Clear all fields
      setMarksType("");
      setTotalMarks("");
      setDate("");
      setCurrentMarks(students.map(() => ""));
      setIsUpdateMode(false);
      setMessage("");

      try {
        const response = await fetch("http://localhost:3000/api/marks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Object.values(updatedMarksData)),
        });
        if (response.ok) {
          alert("Marks uploaded successfully");
          fetchMarksData();
        } else {
          alert("Error uploading marks");
        }
      } catch (error) {
        alert("Error uploading marks: " + error.message);
      }
    } else {
      setMessage("Please fill all data first to add marks.");
    }
  };

  const handleUpdate = async () => {
    const updatedMarksData = students.map((student, index) => ({
      studentId: student._id,
      marksType: selectedClass.marksType,
      marks: currentMarks[index],
      totalMarks: Totalmarks,
      courseId: courseId,
      Date:date,
      teacherId:teacherId
    }));

    // Clear all fields
    setMarksType("");
    setTotalMarks("");
    setDate("")
    setCurrentMarks(students.map(() => ""));
    setIsUpdateMode(false);

    try {
      const response = await fetch("http://localhost:3000/api/marks/marks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMarksData),
      });

      if (response.ok) {
        alert("Marks updated successfully");
        fetchMarksData();
      } else {
        alert("Error updating marks");
      }
    } catch (error) {
      alert("Error updating marks: " + error.message);
    }
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
      <div className="MarksTypeTitleContianer">
        <div className="LabelInputWwrapperMarksTypeTitle">
          <label htmlFor="markstype">Marks for</label>
          <select
            name="markstype"
            id="markstype"
            value={MarksType}
            onChange={handleSelectInputChange}
          >
            <option value="">Select</option>
            <option value="Quiz 1">Quiz 1</option>
            <option value="Quiz 2">Quiz 2</option>
            <option value="Quiz 3">Quiz 3</option>
            <option value="Quiz 4">Quiz 4</option>
            <option value="Assignment 1">Assignment 1</option>
            <option value="Assignment 2">Assignment 2</option>
            <option value="Assignment 3">Assignment 3</option>
            <option value="Assignment 4">Assignment 4</option>
            <option value="Mid Term">Mid Term</option>
            <option value="Final Term">Final Term</option>
            <option value="Lab Assignment 1">Lab Assignment 1</option>
            <option value="Lab Assignment 2">Lab Assignment 2</option>
            <option value="Lab Assignment 3">Lab Assignment 3</option>
            <option value="Lab Assignment 4">Lab Assignment 4</option>
            <option value="Lab Mid">Lab Mid</option>
            <option value="Lab Final">Lab Final</option>
          </select>
        </div>
        <div className="LabelInputWwrapperMarksTypeTitle">
          <label htmlFor="totalmarks">Total Marks</label>
          <input
            onChange={(e) => setTotalMarks(e.target.value)}
            placeholder="Enter total marks here"
            type="text"
            name="totalmarks"
            id="totalmarks"
            value={Totalmarks}
          />
        </div>
        <div className="LabelInputWwrapperMarksTypeTitle">
          <label htmlFor="selectdate">Select Date</label>
          <input
            onChange={(e) => setDate(e.target.value)}
            placeholder="Enter total marks here"
            type="date"
            name="selectdate"
            id="selectdate"
            value={date}
          />
        </div>

        <div className="LabelInputWwrapperDataTime">
          <label className="modifyAttendanceLabel" htmlFor="">
            <p>Select below to modify Marks</p>
          </label>
          <div className="modifySelecterWrwpper">
            <select
              name="marksType"
              id="marksType"
              value={selectedClass ? selectedClass.marksType : ""}
              onChange={(e) => {
                const selectedValue = e.target.value;
                const selected = uniqueMarksTypes.includes(selectedValue)
                  ? {
                      marksType: selectedValue,
                      Totalmarks: fetchedData[selectedValue]
                        ? fetchedData[selectedValue][students[0].username]
                            ?.Totalmarks || ""
                        : "",
                    }
                  : null;
                setSelectedClass(selected);
              }}
            >
              <option value="">Select to Update</option>
              {uniqueMarksTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input
              type="button"
              value="Modify"
              onClick={handleModifyClick}
              className="modifyButton"
            />
          </div>
        </div>

        <div className="StudentMarkslistHeadingWrapperConntainer">
          <div className="StudentMarkslistHaedingwrapper">
            <p>Roll No</p>
            <p className="MarksNameheading">Name</p>
            <p className="marksmarksHeading">Marks</p>
          </div>
        </div>
        <div className="StudentlistWrapperConntainer1">
          {students.map((item, index) => (
            <div className="MarksStudentlistWrapper1" key={index}>
              <p>{item.username}</p>
              <p>{item.fullName}</p>
              <div>
                <input
                  onChange={(e) => handleTextInputChange(e, index)}
                  type="text"
                  value={
                    currentMarks[index] !== undefined ? currentMarks[index] : ""
                  }
                />
              </div>
            </div>
          ))}
        </div>
        {message && <p style={{ color: "red" }}>{message}</p>}
        <button
          className={"MarksSubmitButton"}
          type="button"
          onClick={isUpdateMode ? handleUpdate : handleSubmit}
        >
          {isUpdateMode ? "Update" : "Submit"}
        </button>
      </div>
    </div>
  );
};
