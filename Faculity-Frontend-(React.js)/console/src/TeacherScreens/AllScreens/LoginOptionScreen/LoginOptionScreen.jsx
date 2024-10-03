import "../LoginScreen.css"; // Import your CSS file
import image from "../../../assets/MUST-Logo.png";
import { useNavigate } from 'react-router-dom';
import { TopNavigationBar } from "../../../../components/TopNavigationBar";
const LoginOptionScreen = () => {
  const navigate = useNavigate();
  return (
    <>
    <TopNavigationBar value={false}/>
    <div className="container">
      <div className=" formContainer1">
        <img className="Image" src={image} alt="Image" />
        <h2 className="loginHeading">MUST CMS Login</h2>
        <p className="WelcomeText">Welcome to Mirpur University of science and Techonlogy (MUST) Login Portal</p>
        <p className="WelcomeText2">Teachers, Admin and Coordinators can Login here</p>

        <div className="ButtonsContainer">
          <button
            className="loginOptionsButtons " 
            onClick={()=>{navigate("/Login")}}
            >
            Login As Admin
          </button>{" "}
          <button
            className="loginOptionsButtons"
            onClick={()=>{navigate("/adminLogin")}}
            >
            Login As Coordinator
          </button>{" "}
          <button
            className="loginOptionsButtons"
            onClick={()=>navigate('/teacherLogin')}
            >
            Login As Teacher
          </button>{" "}
        </div>
      </div>
    </div>
            </>
  );
};

export default LoginOptionScreen;
