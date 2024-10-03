import React, { useEffect, useState } from "react";
import "./HomeCard.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HomeCard = ({ courses }) => {
  const [data, setData] = useState([]);
  const [theoryPercentage, setTheoryPercentage] = useState(0);
  const [labPercentage, setLabPercentage] = useState(0);
  const courseId = courses.courseId._id;
  const navigate = useNavigate();
  const { courseName, courseCode, program, session } = courses;

  const fetchAttendance = async () => {
    try {
      const requestBody = { program, session, courseId };
      const res = await axios.post(
        "http://localhost:3000/api/attendance/get",
        requestBody
      );
      setData(res.data);
      calculateLecturePercentages(res.data);
      console.log("Data fetched successfully");
    } catch (error) {
      console.log("Error fetching attendance:", error);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const calculateLecturePercentages = (data) => {
    let totalTheoryStudents = 0;
    let totalTheoryPresent = 0;
    let totalLabStudents = 0;
    let totalLabPresent = 0;

    data.forEach(classData => {
      if (classData.class === "Theory") {
        totalTheoryStudents += classData.attendanceData.length;
        totalTheoryPresent += classData.attendanceData.filter(student => student.isChecked).length;
      } else if (classData.class === "Lab") {
        totalLabStudents += classData.attendanceData.length;
        totalLabPresent += classData.attendanceData.filter(student => student.isChecked).length;
      }
    });

    const theoryPercentage = (totalTheoryPresent / totalTheoryStudents) * 100 || 0;
    const labPercentage = (totalLabPresent / totalLabStudents) * 100 || 0;

    setTheoryPercentage(theoryPercentage);
    setLabPercentage(labPercentage);
  };

  const calculateOverallAttendancePercentage = (data) => {
    if (data.length === 0) return 0;
    let totalStudents = 0;
    let totalPresent = 0;

    data.forEach(classData => {
      totalStudents += classData.attendanceData.length;
      totalPresent += classData.attendanceData.filter(student => student.isChecked).length;
    });

    return (totalPresent / totalStudents) * 100;
  };

  const overallAttendancePercentage = calculateOverallAttendancePercentage(data);

  const getBarColor = (percentage) => {
    if (percentage >= 90) return "green";
    if (percentage >= 85) return "lightgreen";
    if (percentage >= 80) return "lightgreen";
    if (percentage >= 75) return "gold";
    if (percentage >= 70) return "gold";
    if (percentage >= 65) return "orange";
    if (percentage >= 60) return "#8B8000";
    if (percentage >= 55) return "#FF8000";
    if (percentage >= 50) return "#FF3000";
    return "#f00";
  };

  return (
    <div className="CardContainer">
      <h3 className="cardHeading">{courseName}</h3>
      <div className="CardinnerContainer">
        <div>
          <p className="courseDetailsValue">
            <span className="courseDetailsheading">Course No: </span> {courseCode}
          </p>
          <p className="courseDetailsValue">
            <span className="courseDetailsheading">Program: </span> {program}
          </p>
          <p className="courseDetailsValue">
            <span className="courseDetailsheading">Session: </span> {session}
          </p>
          {data.length > 0 && (
            <>
              <p className="courseDetailsValue">
                <span className="courseDetailsheading">Registered Students: </span> {data.length}
              </p>
              <p className="courseDetailsValue">
                <span className="courseDetailsheading">Theory Lectures: </span > <span  style={{ color:"#fff",background: getBarColor(theoryPercentage),padding:5, borderRadius:5 }}>{theoryPercentage.toFixed(2)}%</span>
              </p>
              <p className="courseDetailsValue">
                <span className="courseDetailsheading" >Lab Lectures: </span><span style={{color:"#fff", background: getBarColor(labPercentage) ,padding:5, borderRadius:5 }}> {labPercentage.toFixed(2)}%</span>
              </p>
            </>
          )}
        </div>
        <div style={{ width: 100, height: 100 }}>
          <CircularProgressbar
            strokeWidth={12}
            value={overallAttendancePercentage}
            text={`${overallAttendancePercentage.toFixed(2)}%`}
            styles={buildStyles({
              strokeLinecap: "butt",
              textSize: "20px",
              pathTransitionDuration: 0.5,
              pathColor: getBarColor(overallAttendancePercentage),
              textColor: "#f88",
              trailColor: "#d6d6d6",
            })}
          />
        </div>
      </div>
      <button
        onClick={() => navigate("/ManageCourses", { state: { courseId, session, program } })}
        className="button"
      >
        Manage Course
      </button>
    </div>
  );
};

export default HomeCard;
