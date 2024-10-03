import React, { useEffect, useState } from "react";
import "./AssignStudentCourses.css";
import { TopNavigationBar } from "../../../components/TopNavigationBar";
import axios from "axios";
import { useLocation } from "react-router-dom";

export const AssignStudentCourses = () => {
  const [session, setSession] = useState("");
  const [program, setProgram] = useState("");
  const [semester, setSemester] = useState("");
  const [Semester, setsemester] = useState("");
  const [Semesterprogram, setSemesterprogram] = useState("");
  const [courseList, setCourseList] = useState([]);
  const [semesterCourseList, setSemesterCourseList] = useState([]);
  const [SemesterReenrollCourseList, setSemesterReenrollCourseList] = useState(
    []
  );
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [onGoingsemester, setonGoingSemester] = useState([]);
  const [selectedReenrollCourses, setSelectedReenrollCourses] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [showAddCourses, setShowAddCourses] = useState(false);
  const location = useLocation();
  const { user } = location.state || {};

  useEffect(() => {
    if (program) {
      fetchCourses();
    } else {
      setCourseList([]);
    }
  }, [program]);

  useEffect(() => {
    if (Semesterprogram && Semester) {
      fetchSemesterCourses();
    } else {
      setSemesterCourseList([]);
    }
  }, [Semesterprogram, Semester]);

  useEffect(() => {
    if (Semesterprogram && Semester) {
      fetchSemesterReenrollCourses();
    } else {
      setSemesterReenrollCourseList([]);
    }
  }, [Semesterprogram, Semester]);

  const fetchCourses = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/courses/get",
        {
          program,
        }
      );
      setCourseList(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchSemesterCourses = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/available-courses/getSemesterCourses",
        {
          program: Semesterprogram,
          semester: Semester,
        }
      );
      if (response.status === 200) {
        setSemesterCourseList(response.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchSemesterReenrollCourses = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/available-ReEnroll-courses/getSemesterCourses",
        {
          program: Semesterprogram,
          semester: Semester,
        }
      );
      if (response.status === 200) {
        setSemesterReenrollCourseList(response.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

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

  const handleListCompulsoryCourses = async () => {
    if (!session || !program || !semester) {
      alert(
        "Please select session, program, semester, and at least one course to list available courses."
      );
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/api/available-courses/CourseAvailableList",
        {
          session,
          program,
          semester,
          courseIds: selectedCourses,
        }
      );
      alert("Compulsory Courses Listed successfully");
    } catch (error) {
      console.error("Error Listing courses:", error);
      alert("Error Listing courses: " + error.message);
    }
  };

  const handleListReenrollCourses = async () => {
    if (!session || !program || !semester) {
      alert(
        "Please select session, program, semester, and at least one course to list re-enroll courses."
      );
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/api/available-ReEnroll-courses/ReEnrollCourseAvailableList",
        {
          session,
          program,
          semester,
          courseIds: selectedReenrollCourses,
        }
      );
      alert("Re-Enrolled Courses Listed successfully");
    } catch (error) {
      console.error("Error Listing Re-Enroll courses:", error);
      alert("Error Listing Re-Enroll courses: " + error.message);
    }
  };

  const getCurrentYear = () => new Date().getFullYear();
  const generateYearOptions = () => {
    const currentYear = getCurrentYear();
    return Array.from({ length: 10 }, (_, i) => currentYear + i);
  };

  const handleCourseChange = (courseId) => {
    setSelectedCourses((prevSelectedCourses) =>
      prevSelectedCourses.includes(courseId)
        ? prevSelectedCourses.filter((id) => id !== courseId)
        : [...prevSelectedCourses, courseId]
    );
  };

  const handleReenrollCourseChange = (courseId) => {
    setSelectedReenrollCourses((prevSelectedCourses) =>
      prevSelectedCourses.includes(courseId)
        ? prevSelectedCourses.filter((id) => id !== courseId)
        : [...prevSelectedCourses, courseId]
    );
  };

  const handleCheckAll = () => {
    setSelectedReenrollCourses(courseList.map((course) => course._id));
    setIsChecked(true);
  };

  const handleUncheckAll = () => {
    setSelectedReenrollCourses([]);
    setIsChecked(false);
  };

  return (
    <div>
      <TopNavigationBar gotopath="CoordinatorProfile" />
        <div className="ManageStudentOptionInputsWrapper">
          <h2>List Courses for Student Enrollment</h2>
          <button
            className="AssignStudentButton"
            onClick={() => setShowAddCourses(!showAddCourses)}
          >
            {showAddCourses ? "Hide List New Courses" : "List New Courses"}
          </button>
          {showAddCourses && (
            <>
              <div className="labelInputManageStudentsOptionWrapper">
                <label>Session: </label>
                <select
                  value={session}
                  className="ManageStudentOptionInputs"
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
              <div className="labelInputManageStudentsOptionWrapper">
                <label>Program: </label>
                <select
                  value={program}
                  className="AssignStudentOptionInputs"
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
              <div className="labelInputManageStudentsOptionWrapper">
                <label>Semester: </label>
                <select
                  value={semester}
                  className="AssignStudentOptionInputs"
                  onChange={(e) => setSemester(e.target.value)}
                >
                  <option value="">Select Semester</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                </select>
              </div>
              <div className="labelInputManageStudentsOptionWrapper">
                <h2>Compulsory Courses: </h2>
                <div className="coursesList">
                  {courseList.map((course) => (
                    <div key={course._id} className="courseItem">
                      <input
                        type="checkbox"
                        id={`course-${course._id}`}
                        value={course._id}
                        checked={selectedCourses.includes(course._id)}
                        onChange={() => handleCourseChange(course._id)}
                      />
                      <label htmlFor={`course-${course._id}`}>
                        {course.courseName} ({course.courseCode})
                      </label>
                    </div>
                  ))}
                </div>
                <button
                  className="AssignStudentButton"
                  onClick={handleListCompulsoryCourses}
                >
                  List Compulsory Courses
                </button>
              </div>
              <div className="labelInputManageStudentsOptionWrapper">
                <h2>Re-Enroll Courses: </h2>
                {session && program && semester ? (
                  <div>
                    <button
                      className="checkAllUnchebutton"
                      onClick={isChecked ? handleUncheckAll : handleCheckAll}
                    >
                      {isChecked ? "Uncheck All" : "Check All"}
                    </button>
                  </div>
                ) : (
                  ""
                )}
                <div className="coursesList">
                  {courseList.map((course) => (
                    <div key={course._id} className="courseItem">
                      <input
                        type="checkbox"
                        id={`reenroll-course-${course._id}`}
                        value={course._id}
                        checked={selectedReenrollCourses.includes(course._id)}
                        onChange={() => handleReenrollCourseChange(course._id)}
                      />
                      <label htmlFor={`reenroll-course-${course._id}`}>
                        {course.courseName} ({course.courseCode})
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="AssignStudentButton"
                onClick={handleListReenrollCourses}
              >
                List Re-Enroll Courses
              </button>
            </>
          )}
          <div className="labelInputManageStudentsOptionWrapper">
            <label className="AssignStudentOptionInputs1">Program: </label>
            <select
              value={Semesterprogram}
              className="AssignStudentOptionInputs"
              onChange={(e) => setSemesterprogram(e.target.value)}
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
          <div className="labelInputManageStudentsOptionWrapper">
            <label>Semester: </label>
            <select
              value={Semester}
              className="AssignStudentOptionInputs"
              onChange={(e) => setsemester(e.target.value)}
            >
              <option value="">Select Semester</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
          </div>
          {Semesterprogram !== "" || semester !== "" ? (
            <>
              {semesterCourseList.length > 0 && <h2>Compulsory Courses List for Semester {Semester}</h2>}
              <div className="coursesList">
                {semesterCourseList.length > 0 &&
                  semesterCourseList[0].courses.map((course, index) => (
                    <div key={course._id} className="courseItem">
                      <label htmlFor={`reenroll-course-${course._id}`}>
                        <strong>({index + 1})</strong> {course.courseName} (
                        {course.courseCode})
                      </label>
                    </div>
                  ))}
              </div>
              {SemesterReenrollCourseList.length > 0  &&  <h2>Re-Enroll Courses List for Semester {Semester}</h2> }
              <div className="coursesList">
                {SemesterReenrollCourseList.length > 0 &&
                  SemesterReenrollCourseList[0].courses.map((course, index) => (
                    <div key={course._id} className="courseItem">
                      <label htmlFor={`reenroll-course-${course._id}`}>
                        <strong>({index + 1})</strong> {course.courseName} (
                        {course.courseCode})
                      </label>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <p>
              Select program and semester to show assigned compulsory and
              re-enroll courses for that semester
            </p>
          )}
        </div>

    </div>
  );
};
