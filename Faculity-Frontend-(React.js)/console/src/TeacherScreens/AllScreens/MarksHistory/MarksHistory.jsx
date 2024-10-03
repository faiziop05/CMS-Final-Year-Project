import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TopNavigationBar } from "../../../../components/TopNavigationBar";
import axios from "axios";
import './MarksHistory.css'
export const MarksHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { teacherId, courseDetails } = location.state || {};
  const [students, setStudents] = useState([]);
  const FetchStudentsHistory = async () => {
    try {
      if (teacherId) {
        const requestBody = {
          courseId: courseDetails.courseId,
          teacherId: teacherId,
          session: courseDetails.session,
          program: courseDetails.program,
        };

        const res = await axios.post(
          "http://localhost:3000/api/marks/marks/getStudenthistory",
          requestBody
        );
        // console.log(res.data);
        setStudents(res.data);
        console.log("Data fetched successfully");
      } else {
        console.log("No students data available to fetch attendance.");
      }
    } catch (error) {
      console.log("Error fetching attendance:", error);
    }
  };
  useEffect(() => {
    FetchStudentsHistory();
  }, [teacherId, courseDetails]);
const handleStudentClick=(studentId)=>{
  const requestBody = {
    courseId: courseDetails.courseId,
    teacherId: teacherId,
    session: courseDetails.session,
    program: courseDetails.program,
    studentId:studentId
  };
  
  navigate("/MarksHistoryStudent" ,{ state: { requestBody } })
  
}
  return (
    <div>
      <TopNavigationBar gotopath="TeacherProfile" />
      <div className="StudentlistWrapperConntainer3">
        {students.map((student) => (
          <button onClick={()=>handleStudentClick(student.studentId)} className="StudentlistWrapper3" key={student.studentId}>
              <p>{student.RegNum} </p>
              <p> {student.studentName}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
