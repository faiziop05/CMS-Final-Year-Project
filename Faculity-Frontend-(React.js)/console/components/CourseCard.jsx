import React, { useEffect, useState } from "react";
import "./CourseCard.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCourseId } from "../src/store/authSlice";

const CourseCard = ({ data, onDataFetched }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [students, setStudents] = useState(null);
  const { program, session, courseId } = location.state || {};

  const dispatch = useDispatch();
  dispatch(setCourseId(courseId));

  const fetchEnrolledStudents = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/students/students/by-course/${courseId}`,
        {
          params: { session, program },
        }
      );
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      onDataFetched();
    }
  };

  useEffect(() => {
    fetchEnrolledStudents();
  }, [courseId, session, program]);

  return (
    <button
      onClick={() => navigate(data.page, { state: { students } })}
      className="Coursecardbutton"
    >
      <div className="CourseCardContainer">
        <div className="iconWapper">{data.icon}</div>
        <h2 className="CoursecardHeading">{data.title}</h2>
      </div>
    </button>
  );
};

export default CourseCard;
