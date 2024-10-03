import React, { useEffect, useState } from "react";
import "./History.css";
import { TopNavigationBar } from "../../../../components/TopNavigationBar";
import { useSelector } from "react-redux";
import axios from "axios";
import TeacherHistoryCard from "../../../../components/teacherHistoryCard";

import { MdOutlineCoPresent } from "react-icons/md";
import { IoStatsChartOutline } from "react-icons/io5";
const Data = [
  {
    title: "Attendance Data",
    page: "/AttendanceHistory",
    icon: <MdOutlineCoPresent className="CoursecardIcon" />,
  },
  {
    title: "Marks Data",
    page: "/MarksHistory",
    icon: <IoStatsChartOutline className="CoursecardIcon" />,
  },
];

export const History = () => {
  const teacherId = useSelector((state) => state.auth.teacherId);
  const [courseDetails, setCourseDetails] = useState([]);
  const [SelectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    const fetchCoursesnames = async () => {
      if (teacherId) {
        try {
          const response = await axios.post(
            "http://localhost:3000/api/HistoryRoutes/historyCourseName",
            { teacherId: teacherId }
          );
          setCourseDetails(response.data);
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      }
    };
    fetchCoursesnames();
  }, [teacherId]);
  // console.log(courseDetails);
  const handleOptionChange = (e) => {
    const selectedCourseId = e.target.value;
    const course = courseDetails.find(
      (course) => course.courseId === selectedCourseId
    );
    setSelectedCourse(course);
  };

  return (
    <div>
      <TopNavigationBar gotopath="TeacherProfile"/>
      <div className="HistoryConatiner">
        <div className="courseDetailsselectwarpper">
          <div className="courseDetailsselectInnerwarpper">
            <select
              name="CourseDetails"
              id="CourseDetails"
              onChange={handleOptionChange}
              className="courseDetailsselect"
              defaultValue=""
            >
              <option value="" disabled>
                Select Course
              </option>
              {courseDetails.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseName} ({course.courseCode}) - {course.session} -{" "}
                  {course.program}
                </option>
              ))}
            </select>
          </div>

          {SelectedCourse && SelectedCourse !== ""
            ? Data.map((item, index) => {
                return (
                  <TeacherHistoryCard
                    key={index}
                    teacherId={teacherId}
                    courseDetails={SelectedCourse}
                    data={item}
                  />
                );
              })
            : <div className="pleaseTexthistoryScreen">Please Select Course to show more options</div>}
        </div>
      </div>
    </div>
  );
};
