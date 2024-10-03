// TeacherHomeScreen.js
import React, { useEffect, useState } from "react";
import { TopNavigationBar } from "../../../../components/TopNavigationBar";
import HomeCard from "../../../../components/HomeCard";
import "./TeacherHomeScreen.css";
import { useSelector, useDispatch } from "react-redux";
import { logout as reduxLogout } from "../../../store/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useLogoutConfirmation from "../../../useLogoutConfirmation";

const TeacherHomeScreen = () => {
  const teacherId = useSelector((state) => state.auth.teacherId);
  const [teacher, setTeacher] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Track loading state for all CourseCards




  const fetchTeacherInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/teachers/${teacherId}`
      );
      setTeacher(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching teacher information:", error);
    }
  };

  useEffect(() => {
    fetchTeacherInfo();
  }, [teacherId]);

  const handleLogout = () => {
    dispatch(reduxLogout());
    navigate("/teacherLogin");
  };

  const { showLogoutConfirmation, confirmLogout, cancelLogout } =
    useLogoutConfirmation(handleLogout);

  return (
    <div>
      <TopNavigationBar gotopath="TeacherProfile" />
      <div className="headingButtonhistorywrapper">
        <h2 className="TeacherHomeScreenHeading">Assigned Courses</h2>
        <button
          onClick={() => navigate("/History")}
          className="teacherhomescreenhisotrybutton"
        >
          History
        </button>
      </div>

    {loading ? (
      <div className="spinner-container">
        <div className="loading-spinner"></div>
      </div>
    ) : (
      ""
    )}
      {teacher?.Assignedcourses?.length !== 0 ? (
        <>
          <div className="HomeCardWrapper-wrapper">
            <div className="HomeCardWrapper">
              {teacher?.Assignedcourses?.map((item) => {
                return <HomeCard key={item._id} courses={item} />;
              })}
            </div>
          </div>
          {showLogoutConfirmation && (
            <div className="logoutConfirmation">
              <p>Do you want to logout?</p>
              <button onClick={confirmLogout}>Yes</button>
              <button onClick={cancelLogout}>No</button>
            </div>
          )}
        </>
      ) : (
        <p className="TeacherHomeScreenHeading">No courses Assigned</p>
      )}
    </div>
  );
};

export default TeacherHomeScreen;
