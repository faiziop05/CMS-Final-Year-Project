import React, { useEffect, useState } from "react";
import { TopNavigationBar } from "../../../components/TopNavigationBar";
import AdminHomeCard from "../../../components/AdminHomeCard";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout as reduxLogout } from "../../store/authSlice";
import "./AdminHomeScreen.css";
import {
  MdOutlineCoPresent,
  MdOutlineAssignment,
  MdOutlineAssignmentInd,
} from "react-icons/md";
import { AiOutlineSchedule } from "react-icons/ai";
import { CiMoneyCheck1 } from "react-icons/ci";
import { GiBookshelf } from "react-icons/gi";
import { PiStudentLight } from "react-icons/pi";
import { BsBarChartSteps } from "react-icons/bs";
import useLogoutConfirmation from "../../useLogoutConfirmation";
import axios from "axios";

const Data = [
  {
    title: "Manage Teachers",
    page: "/ManageTeachers",
    icon: <MdOutlineCoPresent className="CoursecardIcon" />,
  },
  {
    title: "Manage Students",
    page: "/ManageStudents",
    icon: <PiStudentLight className="CoursecardIcon" />,
  },
  {
    title: "Assign Students Courses",
    page: "/AssignStudentCourses",
    icon: <GiBookshelf className="CoursecardIcon" />,
  },
  {
    title: "Manage Courses",
    page: "/ManageAllCourses",
    icon: <MdOutlineAssignment className="CoursecardIcon" />,
  },
  {
    title: "Assign Teacher Courses",
    page: "/CourseAssignment",
    icon: <MdOutlineAssignmentInd className="CoursecardIcon" />,
  },
  {
    title: "Time Table",
    page: "/TimeTable",
    icon: <AiOutlineSchedule className="CoursecardIcon" />,
  },
  {
    title: "Fee Challan",
    page: "/Challan",
    icon: <CiMoneyCheck1 className="CoursecardIcon" />,
  },
];

const AdminHomeScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const coordinatorId = useSelector((state) => state.auth.coordinatorId);
  const [coordinator, setCoordinator] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTeacherInfo = async () => {
    if (coordinatorId) {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/CoordinatorRoutes/${coordinatorId}`
        );
        setCoordinator(response.data);
      } catch (error) {
        console.error("Error fetching teacher information:", error);
        setError("Error fetching teacher information");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchTeacherInfo();
  }, [coordinatorId]);

  const handleLogout = () => {
    dispatch(reduxLogout());
    navigate("/adminLogin");
  };

  const { showLogoutConfirmation, confirmLogout, cancelLogout } =
    useLogoutConfirmation(handleLogout);

  return (
    <div>
      <TopNavigationBar gotopath="CoordinatorProfile" />
      <h2 className="AdminHomeScreenTitle">Coordinator Home Screen</h2>

      {loading ? (
        <div className="spinner-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        ""
      )}
      {error && <p>{error}</p>}
      <div className="CourseCardWrapper">
        {Data.map((item, index) => (
          <AdminHomeCard key={index} data={item} user={coordinator} />
        ))}
      </div>
      {showLogoutConfirmation && (
        <div className="logoutConfirmation">
          <p>Do you want to logout?</p>
          <button onClick={confirmLogout}>Yes</button>
          <button onClick={cancelLogout}>No</button>
        </div>
      )}
    </div>
  );
};

export { AdminHomeScreen };
