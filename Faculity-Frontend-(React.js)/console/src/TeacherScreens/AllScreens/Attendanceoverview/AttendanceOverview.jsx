import React from "react";
import "./AttendanceOverview.css";
import { TopNavigationBar } from "../../../../components/TopNavigationBar";
import { useLocation } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export const AttendanceOverview = () => {
  const location = useLocation();
  const { formDataWithAttendance } = location.state || {};
  const calculateAttendancePercentage = (attendanceData) => {
    const studentAttendance = {};

    attendanceData.forEach((classData) => {
      classData.attendanceData.forEach((record) => {
        const { RegNum, StudentName, isChecked } = record;

        if (!studentAttendance[RegNum]) {
          studentAttendance[RegNum] = {
            totalClasses: 0,
            attendedClasses: 0,
            name: StudentName,
          };
        }

        studentAttendance[RegNum].totalClasses += 1;
        if (isChecked) {
          studentAttendance[RegNum].attendedClasses += 1;
        }
      });
    });

    const studentAttendancePercentage = Object.keys(studentAttendance).map(
      (student) => {
        const { totalClasses, attendedClasses, name } =
          studentAttendance[student];
        const percentage = (attendedClasses / totalClasses) * 100;
        return { RegNum: student, name, percentage: percentage.toFixed(2) };
      }
    );

    return studentAttendancePercentage;
  };

  const attendancePercentages = formDataWithAttendance
    ? calculateAttendancePercentage(formDataWithAttendance)
    : [];
    console.log(attendancePercentages);
    
  attendancePercentages.sort((a, b) => a.RegNum.localeCompare(b.RegNum));
  return (
    <div>
      <TopNavigationBar gotopath="TeacherProfile"/>

      <div className="StudentlistWrapperConntainer">
        {attendancePercentages.map((student) => (
          <div className="StudentlistWrapper" key={student.RegNum}>
            <p>{student.RegNum} </p>
            <p> {student.name}</p>
            <div style={{ width: 80, height: 80 ,paddingBottom:50}}>
              <CircularProgressbar
                strokeWidth={10}
                value={student.percentage}
                text={`${student.percentage}%`}
                styles={buildStyles({
                  strokeLinecap: "butt",
                  textSize: "16px",
                  pathTransitionDuration: 0.5,
                  pathColor:
                    student.percentage == 100
                      ? "green"
                      : student.percentage >= 95 
                      ? "lightgreen"
                      : student.percentage >= 90 
                      ? "gold"
                      : student.percentage >= 85 
                      ? "orange"
                      : student.percentage >= 80
                      ? "#8B8000"
                      : student.percentage >= 75
                      ? "#FF4000"
                      : "#f00",
                  textColor: "#f88",
                  trailColor: "#d6d6d6",
                })}
              />
              <p style={{textAlign:"center",fontWeight:"bolder",color:"#555", fontSize:14}}>overall percentage</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
