// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./store/AuthContext";
import {
  LoginOptionScreen,
  CourseContents,
  Assignment,
  TeacherProfile,
  TaecherLoginSceen,
  TeacherHomeScreen,
  ManageCourses,
  ManageAttendance,
  MannageMarks,
  AttendanceOverview,
  History,
  MarksHistory,
  AttendanceHistory,
  MarksHistoryStudent
} from "./TeacherScreens";
import PrivateRoute from "./PrivateRoute";
import {
  CourseAssignment,
  AssignStudentCourses,
  ManageStudents,
  AdminHomeScreen,
  AdminLogin,
  TimeTable,
  Challan,
  ManageTeachers,
  ManageAllCourses,
  CoordinatorProfile
} from "./AdminScreens";
import { Login, MainAdminHomeScreen, ManageCoordinators, ManageSemester, AdminProfile } from "./MainAdmin";

function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginOptionScreen />} />
          <Route path="/teacherLogin" element={<TaecherLoginSceen />} />
          <Route path="/adminLogin" element={<AdminLogin />} />
          <Route path="/Login" element={<Login />} />

          <Route path="/HomeScreen" element={<PrivateRoute element={TeacherHomeScreen} allowedRoles={['teacher']} />} />
          <Route path="/ManageCourses" element={<PrivateRoute element={ManageCourses} allowedRoles={['teacher']} />} />
          <Route path="/TeacherProfile" element={<PrivateRoute element={TeacherProfile} allowedRoles={['teacher']} />} />
          <Route path="/ManageAttendance" element={<PrivateRoute element={ManageAttendance} allowedRoles={['teacher']} />} />
          <Route path="/MannageMarks" element={<PrivateRoute element={MannageMarks} allowedRoles={['teacher']} />} />
          <Route path="/Assignment" element={<PrivateRoute element={Assignment} allowedRoles={['teacher']} />} />
          <Route path="/CourseContents" element={<PrivateRoute element={CourseContents} allowedRoles={['teacher']} />} />
          <Route path="/AttendanceOverview" element={<PrivateRoute element={AttendanceOverview} allowedRoles={['teacher']} />} />
          <Route path="/History" element={<PrivateRoute element={History} allowedRoles={['teacher']} />} />
          <Route path="/MarksHistory" element={<PrivateRoute element={MarksHistory} allowedRoles={['teacher']} />} />
          <Route path="/MarksHistoryStudent" element={<PrivateRoute element={MarksHistoryStudent} allowedRoles={['teacher']} />} />
          <Route path="/AttendanceHistory" element={<PrivateRoute element={AttendanceHistory} allowedRoles={['teacher']} />} />

          <Route path="/AdminHomeScreen" element={<PrivateRoute element={AdminHomeScreen} allowedRoles={['coordinator']} />} />
          <Route path="/TimeTable" element={<PrivateRoute element={TimeTable} allowedRoles={['coordinator']} />} />
          <Route path="/Challan" element={<PrivateRoute element={Challan} allowedRoles={['coordinator']} />} />
          <Route path="/ManageTeachers" element={<PrivateRoute element={ManageTeachers} allowedRoles={['coordinator']} />} />
          <Route path="/ManageAllCourses" element={<PrivateRoute element={ManageAllCourses} allowedRoles={['coordinator']} />} />
          <Route path="/CourseAssignment" element={<PrivateRoute element={CourseAssignment} allowedRoles={['coordinator']} />} />
          <Route path="/ManageStudents" element={<PrivateRoute element={ManageStudents} allowedRoles={['coordinator']} />} />
          <Route path="/AssignStudentCourses" element={<PrivateRoute element={AssignStudentCourses} allowedRoles={['coordinator']} />} />
          <Route path="/CoordinatorProfile" element={<PrivateRoute element={CoordinatorProfile} allowedRoles={['coordinator']} />} />

          <Route path="/MainAdminHomeScreen" element={<PrivateRoute element={MainAdminHomeScreen} allowedRoles={['admin']} />} />
          <Route path="/ManageCoordinators" element={<PrivateRoute element={ManageCoordinators} allowedRoles={['admin']} />} />
          <Route path="/ManageSemester" element={<PrivateRoute element={ManageSemester} allowedRoles={['admin']} />} />
          <Route path="/AdminProfile" element={<PrivateRoute element={AdminProfile} allowedRoles={['admin']} />} />
        </Routes>

    </AuthProvider>
  );
}

export default App;
