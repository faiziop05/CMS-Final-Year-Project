import React, { useState } from "react";
import "./LoginScreen.css";
import image from "../../assets/MUST-Logo.png";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { TopNavigationBar } from "../../../components/TopNavigationBar";
import { useAuth } from "../../store/AuthContext";
import { setCoordinatorId } from "../../store/authSlice";


const AdminLogin = () => {
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
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(setCoordinatorId(data._id));
        login(data.token, 'coordinator');
        navigate("/AdminHomeScreen");
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
      e.preventDefault(); 
      handleLogin();     
    }
  };
  return (
    <>
      <TopNavigationBar value={false} />
      <div className="container">
        <div className="formContainer">
          <img className="Image" src={image} alt="Image" />
          <h2 className="loginHeading">MUST Coordinator Portal Login</h2>
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

export default AdminLogin;
