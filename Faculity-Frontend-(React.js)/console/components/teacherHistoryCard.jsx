import React from "react";
import "./CourseCard.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

const TeacherHistoryCard = ({teacherId ,courseDetails, data }) => {
  const navigate = useNavigate();


  return (
    <button
      onClick={() =>
        navigate(data.page, { state: {  teacherId,courseDetails } })
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

export default TeacherHistoryCard;
