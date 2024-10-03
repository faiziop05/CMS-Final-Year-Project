import React, { useState, useCallback, useEffect } from "react";
import { TopNavigationBar } from "../../../../components/TopNavigationBar";
import { useLocation } from "react-router-dom";
import "./ManageAttendance.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

export const ManageAttendance = React.memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { students } = location.state || {};
  const teacherId = useSelector((state) => state.auth.teacherId);
  const courseId = useSelector((state) => state.auth.courseId);
  const [formDataWithAttendance, setFormDataWithAttendance] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendanceData, setAttendanceData] = useState(
    students.map((student) => ({
      _id: student._id, // student id
      RegNum: student.username,
      StudentName: student.fullName,
      isChecked: true, // Initialize all checkboxes as checked by default
      studentId: student._id,
      session: student.session,
      program: student.program,
    }))
  );
  const [formData, setFormData] = useState({
    class: "",
    classType: "",
    date: "",
    startTime: "",
    endTime: "",
    title: "",
    courseId: courseId, // include courseId in the form data
    teacherId:teacherId,
  });

  const fetchAttendance = async () => {
    try {
      if (students.length > 0) {
        const program = students[0].program; // Ensure this is correct
        const session = students[0].session; // Ensure this is correct
        const requestBody = { program, session, courseId };
        const res = await axios.post(
          "http://localhost:3000/api/attendance/get",
          requestBody
        );
        setFormDataWithAttendance(res.data);
        console.log("Data fetched successfully");
      } else {
        console.log("No students data available to fetch attendance.");
      }
    } catch (error) {
      console.log("Error fetching attendance:", error);
    }
  };
  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleCheckboxChange = useCallback(
    (index) => {
      const newAttendanceData = [...attendanceData];
      newAttendanceData[index].isChecked = !newAttendanceData[index].isChecked;
      setAttendanceData(newAttendanceData);
    },
    [attendanceData]
  );

  const handleCheckAll = useCallback(() => {
    const newAttendanceData = attendanceData.map((student) => ({
      ...student,
      isChecked: !attendanceData.every((s) => s.isChecked),
    }));
    setAttendanceData(newAttendanceData);
  }, [attendanceData]);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    },
    [formData]
  );

  const isWithinAllowedTime = () => {
    const now = new Date();
    const day = now.getDay(); // Sunday - Saturday : 0 - 6
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const time = hour * 60 + minutes; // Total minutes from 00:00
  
    // Monday to Friday, and between 8:30 AM and 4:30 PM
    const isWeekday = day >= 1 && day <= 5;
    const isWithinTime = time >= 8 * 60 + 30 && time <= 16 * 60 + 30;
    
    // Ensure the selected date is today or a past date
    const selectedDate = new Date(formData.date);
    const selectedDateWithoutTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const nowWithoutTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const isNotFutureDate = selectedDateWithoutTime <= nowWithoutTime;
    // return isWeekday && isWithinTime && isNotFutureDate;
    return isWeekday&& isWithinTime && isNotFutureDate;
  };
// console.log(isWithinAllowedTime());
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!isWithinAllowedTime()) {
        alert(
          "You can only submit attendance for today or past dates between 8:30 AM and 4:30 PM, Monday to Friday."
        );
        return;
      }
      if (
        formData.class &&
        formData.classType &&
        formData.date &&
        formData.startTime &&
        formData.endTime &&
        formData.title
      ) {
        const completeFormData = attendanceData.map((student) => ({
          ...formData,
          studentId: student._id, // include student id
          RegNum: student.RegNum,
          StudentName: student.StudentName,
          isChecked: student.isChecked,
          session: student.session,
          program: student.program,
        }));
        try {
          await axios.post(
            "http://localhost:3000/api/attendance/add",
            completeFormData
          );
          setFormDataWithAttendance([
            ...formDataWithAttendance,
            ...completeFormData,
          ]);
          setFormData({
            class: "",
            classType: "",
            date: "",
            startTime: "",
            endTime: "",
            title: "",
            courseId: courseId,
            teacherId:teacherId,
          });
          fetchAttendance()
          alert("Successfully Uploaded Attendance");
        } catch (error) {
          alert("Error uploading attendance. Please try again.");
        }
      } else {
        alert(
          "Please select all data, i.e., class type, date, start time, end time, and title"
        );
      }
    },
    [attendanceData, formData, formDataWithAttendance, courseId]
  );

  const handleModify = useCallback(() => {
    if (selectedClass) {
      const selected = formDataWithAttendance.find(
        (item) =>
          item.title === selectedClass.title &&
          item.classType === selectedClass.classType &&
          item.date === selectedClass.date
      );

      if (selected) {
        const newAttendanceData = attendanceData.map((student) => {
          const studentAttendance = selected.attendanceData.find(
            (attendance) => attendance.RegNum === student.RegNum
          );
          if (studentAttendance) {
            return {
              ...student,
              isChecked: studentAttendance.isChecked,
            };
          } else {
            return {
              ...student,
              isChecked: false,
            };
          }
        });
        setAttendanceData(newAttendanceData);

        setFormData({
          class: selected.class,
          classType: selected.classType,
          date: selected.date,
          startTime: selected.startTime,
          endTime: selected.endTime,
          title: selected.title,
          courseId: selected.courseId,
        });

        setUpdateMode(true);
      } else {
        console.log("Selected class not found in formDataWithAttendance");
      }
    }
  }, [attendanceData, selectedClass, formDataWithAttendance]);

  const handleUpdate = useCallback(async () => {
    if (!isWithinAllowedTime()) {
      alert(
        "You can only update attendance for today or past dates between 8:30 AM and 4:30 PM, Monday to Friday."
      );
      return;
    }
    const updatedAttendanceData = attendanceData.map((student) => ({
      class: formData.class,
      classType: formData.classType,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      title: formData.title,
      courseId: formData.courseId,
      studentId: student.studentId, // Use the studentId fetched from the backend
      RegNum: student.RegNum,
      StudentName: student.StudentName,
      isChecked: student.isChecked,
    }));
    try {
      await axios.post(
        "http://localhost:3000/api/attendance/update",
        updatedAttendanceData
      );
      setFormData({
        class: "",
        classType: "",
        date: "",
        startTime: "",
        endTime: "",
        title: "",
        courseId: courseId,
      });
      setUpdateMode(false);
      fetchAttendance()
      alert("Successfully Updated Attendance");
    } catch (error) {
      alert("Error updating attendance. Please try again.");
    }
  }, [attendanceData, formData, courseId]);

  const [updateMode, setUpdateMode] = useState(false);

  return (
    <form onSubmit={handleSubmit}>
      <TopNavigationBar gotopath="TeacherProfile"/>
      {!students || students.length === 0 ? (
        <div className="DateTimeContainer">
          <p>No students registered.</p>
        </div>
      ) : (
        <div>
          <div className="AttendanceOverviewButtoncontainer">
            <button
              onClick={() =>
                navigate("/AttendanceOverview", {
                  state: { formDataWithAttendance },
                })
              }
              className="AttendanceOverviewButton"
            >
              Attendance Overview
            </button>
          </div>

          <div className="DateTimeContainer">
            <div className="LabelInputWwrapperDataTime">
              <label htmlFor="classType">Class</label>
              <select
                name="class"
                id="classType"
                value={formData.class}
                onChange={handleInputChange}
              >
                <option value="">Select class</option>
                <option value="Theory">Theory</option>
                <option value="Lab">Lab</option>
              </select>
            </div>
            <div className="LabelInputWwrapperDataTime">
              <label htmlFor="classType">Class Type</label>
              <select
                name="classType"
                id="classType"
                value={formData.classType}
                onChange={handleInputChange}
              >
                <option value="">Select class Type</option>
                <option value="Regular">Regular</option>
                <option value="Reschedule">Reschedule</option>
              </select>
            </div>

            <div className="LabelInputWwrapperDataTime">
              <label htmlFor="date">Select Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>
            <div className="LabelInputWwrapperDataTime">
              <label htmlFor="startTime">Select Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
              />
            </div>

            <div className="LabelInputWwrapperDataTime">
              <label htmlFor="endTime">Select End Time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
              />
            </div>
            <div className="LabelInputWwrapperDataTime">
              <label htmlFor="title">Add Title</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Title Here"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="LabelInputWwrapperDataTime">
              <label className="modifyAttendanceLabel" htmlFor="">
                <p>Select below to modify Attendance</p>
              </label>
              <div className="modifySelecterWrwpper">
                <select
                  name="ClassType"
                  id="ClassType"
                  value={
                    selectedClass
                      ? `${selectedClass.class}-${selectedClass.date}-${selectedClass.title}`
                      : ""
                  }
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    const selected = formDataWithAttendance.find(
                      (item) =>
                        `${item.class}-${item.date}-${item.title}` ===
                        selectedValue
                    );
                    setSelectedClass(selected);
                  }}
                >
                  <option value="">Select a class</option>
                  {formDataWithAttendance.map((item, index) => (
                    <option
                      key={index}
                      value={`${item.class}-${item.date}-${item.title}`}
                    >
                      {item.class}-{item.date}-{item.title}
                    </option>
                  ))}
                </select>
                <input
                  type="button"
                  value="Modify"
                  onClick={handleModify}
                  className="modifyButton"
                />
              </div>
            </div>
          </div>

          <div className="CheckBoxSelectAllButtonWrapper">
            <input
              onClick={handleCheckAll}
              type="button"
              value="Check All / Uncheck All"
              className="CheckBoxSelectAllButton"
            />
          </div>
          <div className="StudentlistHeadingWrapperConntainer">
            <div className="StudentlistHaedingwrapper">
              <p>Roll No</p>
              <p className="Nameheading">Name</p>
              <p>Attendance</p>
            </div>
          </div>

          <div className="StudentlistWrapperConntainer">
            {attendanceData.map((item, index) => {
              return (
                <div className="StudentlistWrapper" key={index}>
                  <p>{item.RegNum}</p>
                  <p>{item.StudentName}</p>
                  <div>
                    <input
                      onChange={() => handleCheckboxChange(index)}
                      checked={item.isChecked}
                      type="checkbox"
                      name={`Attendancecheckbox-${index}`}
                      id={`Attendancecheckbox-${index}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <button
            className={"AttendanceSubmitButton"}
            type="button"
            onClick={updateMode ? handleUpdate : handleSubmit}
          >
            {updateMode ? "Update" : "Submit"}
          </button>
        </div>
      )}
    </form>
  );
});

export default ManageAttendance;
