import React, { useState } from "react";
import "../LoginScreen.css";
import image from "../../../assets/MUST-Logo.png"
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setTeacherId } from "../../../store/authSlice";
import { TopNavigationBar } from "../../../../components/TopNavigationBar";
import { useAuth } from "../../../store/AuthContext";

const TeacherLoginScreen = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    if (username === "" && password === "") {
      setError("Username and password are required.");
      return;
    }
    if (username === "") {
      setError("Username is required.");
      return;
    }
    if (password === "") {
      setError("Password is required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/teacherLogin/TeacherLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(setTeacherId(data._id));
        login(data.token, 'teacher');
        navigate("/HomeScreen");
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.log(err);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default form submission behavior
      handleLogin();     // Call your login function
    }
  };
  return (
    <>
      <TopNavigationBar value={false} />
      <div className="container">
        <div className="formContainer">
          <img className="Image" src={image} alt="Image" />
          <h2 className="loginHeading">MUST Teacher Portal Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="inputField"
            onKeyDown={handleKeyDown}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="inputField"
            onKeyDown={handleKeyDown}
          />
          {error && <p className="errorMessage">{error}</p>}
          <button className="loginButton" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </>
  );
};

export default TeacherLoginScreen;
