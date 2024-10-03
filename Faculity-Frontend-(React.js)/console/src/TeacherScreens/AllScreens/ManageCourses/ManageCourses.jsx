import React, { useState } from "react";
import CourseCard from "../../../../components/CourseCard";
import { TopNavigationBar } from "../../../../components/TopNavigationBar";
import "./ManageCourses.css";
import { MdOutlineCoPresent } from "react-icons/md";
import { IoStatsChartOutline } from "react-icons/io5";
import { MdOutlineAssignment } from "react-icons/md";
import { CgNotes } from "react-icons/cg";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";

const Data = [
  {
    title: "Attendance",
    page: "/ManageAttendance",
    icon: <MdOutlineCoPresent className="CoursecardIcon" />,
  },
  {
    title: "Marks",
    page: "/MannageMarks",
    icon: <IoStatsChartOutline className="CoursecardIcon" />,
  },
  {
    title: "Assignments",
    page: "/Assignment",
    icon: <MdOutlineAssignment className="CoursecardIcon" />,
  },
  {
    title: "Course Contents",
    page: "/CourseContents",
    icon: <CgNotes className="CoursecardIcon" />,
  },
];

const ManageCourses = () => {
  const [loading, setLoading] = useState(true); // Track loading state for all CourseCards

  const handleDataFetched = () => {
    setLoading(false);
  };

  return (
    <div>
      <TopNavigationBar gotopath="TeacherProfile" />
      <h2 className="manageCoursesheading">Manage Courses</h2>
      {loading ? (
        <div className="spinner-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        ""
      )}
      <div className="CourseCardWrapper">
        {Data.map((item, index) => {
          return (
            <CourseCard
              key={index}
              data={item}
              onDataFetched={handleDataFetched}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ManageCourses;
