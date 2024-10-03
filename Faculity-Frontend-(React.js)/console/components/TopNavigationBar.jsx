import React from "react";
import "./TopNavigationBar.css";
import { Link } from "react-router-dom";
import image from "../src/assets/MUST-Logo.png";
import { CgProfile } from "react-icons/cg";

export const TopNavigationBar = ({ value ,gotopath}) => {
  return (
    <nav className="TopNavigationConatiner">
      <div className="LinkStyling" to="/HomeScreen">
        <div className="NavBarLogoConatiner">
          <img className="TopNavImage" src={image} alt="Image" />
          <p className="TopNavLogoText">CMS MUST</p>
        </div>
      </div>

      {value !== false ? (
        <Link className="LinkStylingcon" to={`/${gotopath}`}>
          <div className="LinkStyling">
            <CgProfile className="ProfileIcon" />
            <p>Profile</p>
          </div>
        </Link>
      ) : (
        <div></div>
      )}
    </nav>
  );
};
