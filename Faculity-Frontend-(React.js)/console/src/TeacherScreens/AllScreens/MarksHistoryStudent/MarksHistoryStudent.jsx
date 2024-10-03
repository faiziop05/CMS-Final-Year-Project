import React, { useEffect, useState } from "react";
import "./MarksHistoryStudent.css";
import { TopNavigationBar } from "../../../../components/TopNavigationBar";
import { useLocation } from "react-router-dom";
import axios from "axios";
export const MarksHistoryStudent = () => {
  const location = useLocation();
  const { requestBody } = location.state || {};
  console.log(requestBody);

  const [marks, setMarks] = useState([]);
  const fetchMarks = async () => {
    try {
      if (requestBody) {
        const res = await axios.post(
          "http://localhost:3000/api/marks//marks/getStudenthistoryStudent",
          requestBody
        );

        setMarks(res.data);
        console.log("Data fetched successfully");
      } else {
        console.log("No students data available to fetch attendance.");
      }
    } catch (error) {
      console.log("Error fetching attendance:", error);
    }
  };
  useEffect(() => {
    fetchMarks();
  }, [requestBody]);

  return (
    <div>
      <TopNavigationBar gotopath="TeacherProfile" />
      <div className="StudentlistWrapperConntainer4">
        <div className="NameRollNumWrapper">
          <p><strong>Name: </strong>{marks[0]?.StudentName}</p>
          <p><strong>Roll No: </strong>{marks[0]?.RegNum}</p>
        </div>
        {marks.map((mark, index) => {
          return (
            <div className="StudentlistWrapper4" key={index}>
              <p className="studentMatksTypep">{mark.marksType}</p>
              <p>
                <strong>Total Marks: </strong>
                {mark.TotalMarks}
              </p>
              <p>
                {" "}
                <strong>Gained Marks: </strong>
                {mark.Marks}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
