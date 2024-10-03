import React, { useState, useEffect } from "react";
import "./CourseAssignment.css";
import { TopNavigationBar } from "../../../components/TopNavigationBar";
import axios from "axios";
import { useLocation } from "react-router-dom";

export const CourseAssignment = () => {
  const [teacherList, setTeacherList] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [program, setProgram] = useState("");
  const [session, setSession] = useState("");
  const [onGoingSemester, setonGoingSemester] = useState([]);
  const location = useLocation();
  const { user } = location.state || {};
  const fetchSemester = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/semester/getongoingSemester"
      );
      setonGoingSemester(res.data);
    } catch (error) {
      alert("Error fetching semester data. Please try again.");
    }
  };

  useEffect(() => {
    fetchSemester();
  }, []);
  const fetchTeacherList = async () => {
    if (program) {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/teachers/get",
          { program }
        );
        setTeacherList(response.data);
      } catch (error) {
        console.error("Error fetching teacher list:", error);
      }
    }
  };

  const fetchCourses = async () => {
    if (program) {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/courses/get",
          { program }
        );
        setCourseList(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }
  };

  useEffect(() => {
    fetchTeacherList();
  }, [program]);
  useEffect(() => {
    fetchCourses();
  }, [program]);

  const handleAssign = async () => {
    if (!selectedTeacher || selectedCourses.length === 0) {
      alert("Please select a teacher and at least one course to assign.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/teachers/assign-course", {
        teacherId: selectedTeacher,
        courseIds: selectedCourses,
        session,
        program,
        semesterName: onGoingSemester[0]?.semesterName,
      });
      alert("Course(s) assigned successfully");
      fetchTeacherList();
    } catch (error) {
      console.error("Error assigning course:", error);
    }
  };

  const unassignCourse = async (teacherId, courseId,session) => {
    try {
      await axios.post("http://localhost:3000/api/teachers/unassign-course", {
        teacherId,
        courseId,
        session,
        program,
      });
      alert("Course unassigned successfully");
      fetchTeacherList();
    } catch (error) {
      console.error("Error unassigning course:", error);
    }
  };
  const getCurrentYear = () => new Date().getFullYear();
  const generateYearOptions = () => {
    const currentYear = getCurrentYear();
    return Array.from({ length: 10 }, (_, i) => currentYear + i);
  };

  return (
    <div>
      <TopNavigationBar gotopath="CoordinatorProfile" />

        <div className="assignment-container">
          <div className="selectoptionwrapper">
            <h2>Assign Courses to Teachers</h2>
            <div className="form-group">
              <label htmlFor="program">Select Program</label>
              <select
                value={program}
                className="selectoptionCourseAssngment"
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
            <div className="form-group">
              <label htmlFor="teacher">Select Teacher</label>
              <select
                id="teacher"
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="selectoptionCourseAssngment"
              >
                <option value="">Select a teacher</option>
                {teacherList.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.fullName} ({teacher.post})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="session">Select Session</label>
              <select
                value={session}
                className="selectoptionCourseAssngment"
                onChange={(e) => setSession(e.target.value)}
              >
                <option value="">Select Session</option>
                {generateYearOptions().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="courses">Select Courses</label>
              <select
                id="courses"
                value={selectedCourses}
                className="selectoptionCourseAssngment2"
                onChange={(e) =>
                  setSelectedCourses(
                    Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    )
                  )
                }
              >
                <option value="">Select Course to assign</option>
                {courseList.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.courseName} ({course.courseCode})
                  </option>
                ))}
              </select>
            </div>
            <button className="CourseassignButton" onClick={handleAssign}>
              Assign
            </button>
            <div>
              <h2 style={{textAlign:"center"}}>Assigned Courses</h2>
              {program ? 
              <>
                {teacherList
                  .filter(
                    (teacher) =>
                      teacher.Assignedcourses &&
                      teacher.Assignedcourses.length > 0
                  )
                  .map((teacher) => (
                    <ul className="assignedCoursesList" key={teacher._id}>
                      <h3>
                        <strong>Instructor: </strong>
                        {teacher.fullName} ({teacher.post})
                      </h3>
                      <div>
                        {teacher.Assignedcourses.map((course) => (
                          <div
                            className="courseitemwapper"
                            key={course.courseId}
                          >
                            <div>
                              <li>
                                <strong>Course Name: </strong>
                                {course.courseName}
                              </li>
                              <li>
                                <strong>Course Code: </strong>
                                {course.courseCode}
                              </li>
                              <li>
                                <strong>Session: </strong>
                                {course.session}
                              </li>
                              <li>
                                <strong>Program: </strong>
                                {course.program}
                              </li>
                              <li>
                                <strong>Semester: </strong>
                                {course.semesterName}
                              </li>
                            </div>
                            <button
                              className="courseUnassignButton"
                              onClick={() =>
                                unassignCourse(teacher._id, course.courseId,course.session)
                              }
                            >
                              Unassign
                            </button>
                          </div>
                        ))}
                      </div>
                    </ul>
                  ))}
              </>
               : <p style={{textAlign:"center"}}>Select Program to show assiged Courses</p> }
            </div>
          </div>
        </div>

    </div>
  );
};
