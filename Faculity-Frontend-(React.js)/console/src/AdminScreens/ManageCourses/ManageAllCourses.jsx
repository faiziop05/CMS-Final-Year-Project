import React, { useEffect, useState } from "react";
import { TopNavigationBar } from "../../../components/TopNavigationBar";
import "./ManageAllCourses.css";
import axios from "axios";
import { useLocation } from "react-router-dom";

export const ManageAllCourses = () => {
  const [Addcourse, setAddCourse] = useState({
    courseName: "",
    courseCode: "",
    creditHours: "",
    program: "",
  });
  const [courseList, setCourseList] = useState([]);
  const [courseList2, setCourseList2] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);
  const [program, setProgram] = useState("");
  const [preReq, setPreReq] = useState("");
  const [errors, setErrors] = useState({});
  const location = useLocation();
  const { user } = location.state || {};

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
    fetchCourses();
  }, [program]);
  const fetchCourses2 = async () => {
    if (Addcourse.program) {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/courses/get",
          { program:Addcourse.program }
        );
        setCourseList2(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }
  };

  useEffect(() => {
    fetchCourses2();
  }, [Addcourse.program]);

  const validateInputs = () => {
    const newErrors = {};
    if (!Addcourse.courseName) newErrors.courseName = "Course Name is required";
    if (!Addcourse.courseCode) newErrors.courseCode = "Course Code is required";
    if (!Addcourse.creditHours)
      newErrors.creditHours = "Credit Hours are required";
    if (!Addcourse.program) newErrors.program = "Program is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddbutton = async () => {
    if (!validateInputs()) return;

    if (isEditing) {
      await handleUpdateCourse();
      return;
    }

    const newCourse = {
      courseName: Addcourse.courseName,
      courseCode: Addcourse.courseCode,
      creditHours: Addcourse.creditHours,
      program: Addcourse.program,
      preReq:preReq
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/courses",
        newCourse
      );
      setCourseList([...courseList, response.data]);
      setAddCourse({
        courseName: "",
        courseCode: "",
        creditHours: "",
        program: "",
      });
      setPreReq("")
      setErrors({});
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const handleEditCourse = (course) => {
    setAddCourse({
      courseName: course.courseName,
      courseCode: course.courseCode,
      creditHours: course.creditHours,
      program: course.program,
    });
    setEditCourseId(course._id);
    setIsEditing(true);
  };

  const handleUpdateCourse = async () => {
    if (!validateInputs()) return;

    const updatedCourse = {
      courseName: Addcourse.courseName,
      courseCode: Addcourse.courseCode,
      creditHours: Addcourse.creditHours,
      program: Addcourse.program,
      preReq:preReq
    };

    try {
      const response = await axios.put(
        `http://localhost:3000/api/courses/${editCourseId}`,
        updatedCourse
      );
      const updatedCourseList = courseList.map((course) =>
        course._id === editCourseId ? response.data : course
      );
      setCourseList(updatedCourseList);
      setAddCourse({
        courseName: "",
        courseCode: "",
        creditHours: "",
        program: "",
      });
      setPreReq("");
      setEditCourseId(null);
      setIsEditing(false);
      setErrors({});
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/courses/${id}`);
      setCourseList(courseList.filter((course) => course._id !== id));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <div>
      <TopNavigationBar gotopath="CoordinatorProfile" />
      <div className="inputinfowrapper">
        <h2>{isEditing ? "Edit Course" : "Add New Course"}</h2>
        <input
          placeholder="Course Name"
          className="ManageCoursesInputs"
          type="text"
          value={Addcourse.courseName}
          onChange={(e) =>
            setAddCourse({ ...Addcourse, courseName: e.target.value })
          }
        />
        {errors.courseName && <p className="error">{errors.courseName}</p>}
        <input
          placeholder="Course Code"
          className="ManageCoursesInputs"
          type="text"
          value={Addcourse.courseCode}
          onChange={(e) =>
            setAddCourse({ ...Addcourse, courseCode: e.target.value })
          }
        />
        {errors.courseCode && <p className="error">{errors.courseCode}</p>}
        <input
          placeholder="Credit Hours"
          className="ManageCoursesInputs"
          type="text"
          value={Addcourse.creditHours}
          onChange={(e) =>
            setAddCourse({ ...Addcourse, creditHours: e.target.value })
          }
        />
        {errors.creditHours && <p className="error">{errors.creditHours}</p>}
        <select
          id="teacher"
          value={Addcourse.program}
          onChange={(e) =>
            setAddCourse({ ...Addcourse, program: e.target.value })
          }
          className="selectoptionCourseAssngment"
        >
          <option value="">Select a Program</option>
          {user.assignedDepartments.map((item, index) => {
            return (
              <option key={index} value={item}>
                {item}
              </option>
            );
          })}
        </select>
        {errors.program && <p className="error">{errors.program}</p>}
        <select
          id="teacher"
          value={preReq}
          onChange={(e) => setPreReq(e.target.value)}
          className="selectoptionCourseAssngment"
        >
          <option value="">Select a Pre-Req Course</option>
          {courseList2.map((item, index) => {
            
            return (
              <option key={index} value={item._id}>
                {item.courseName} ({item.courseCode}) - {item.creditHours}{" "}
              </option>
            );
          })}
        </select>
        <button className="courseAddbutton" onClick={handleAddbutton}>
          {isEditing ? "Update" : "Add"}
        </button>
        <select
          id="courseprogram"
          value={program}
          onChange={(e) => setProgram(e.target.value)}
          className="selectoptionCourseAssngment"
        >
          <option value="">Select a Program to get courses</option>
          {user.assignedDepartments.map((item, index) => {
            return (
              <option key={index} value={item}>
                {item}
              </option>
            );
          })}
        </select>
        <div>
          {courseList.map((item) => (
            <div className="RegisterdCourseListWrapper" key={item._id}>
              <p>
                {item.courseName} ({item.courseCode}) - {item.creditHours}{" "}
                Credit Hours
              </p>
              <div>
                <button
                  className="RegisterdCourseListUpdateButton"
                  onClick={() => handleEditCourse(item)}
                >
                  Edit
                </button>
                <button
                  className="RegisterdCourseListDeleteButton"
                  onClick={() => handleDeleteCourse(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
