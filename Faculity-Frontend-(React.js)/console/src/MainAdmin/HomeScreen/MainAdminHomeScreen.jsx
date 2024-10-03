import React, { useEffect, useState } from "react";
import AdminHomeCard from "../../../components/AdminHomeCard";
import "./MainAdminHomeScreen.css";
import { TopNavigationBar } from "../../../components/TopNavigationBar";
import { MdOutlineCoPresent } from "react-icons/md";
import { BsBarChartSteps } from "react-icons/bs";
export const MainAdminHomeScreen = () => {
  const Data = [
    {
      title: "Manage Coordintors",
      page: "/ManageCoordinators",
      icon: <MdOutlineCoPresent className="CoursecardIcon" />,
    },
    {
      title: "Manage Semester",
      page: "/ManageSemester",
      icon: <BsBarChartSteps className="CoursecardIcon" />,
    },
  ];
  return (
    <div>
      <TopNavigationBar gotopath="AdminProfile" />
      <div className="mainadminhomescreencontainer">
        <h2 style={{ textAlign: "center" }}>Admin Home Screen</h2>
        <div className="MainAdminHomeScreenTitle">
          {Data.map((item, index) => {
            return <AdminHomeCard key={index} data={item} />;
          })}
        </div>
      </div>
    </div>
  );
};
