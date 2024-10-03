import React from "react";
import "./CourseCard.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useLocation, useNavigate } from "react-router-dom";

const CourseCard = ({ data,user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { RegisteredStudents } = location.state || {};

  return (
    <button
      onClick={() =>
        navigate(data.page ,{ state: { RegisteredStudents,user } })
      }
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
