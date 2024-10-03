import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from './config/db.js';

import './scheduler/schedule.js';

import teacherRoutes from "./routes/teacherRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import authRoutes from './routes/authRoutes.js';
import TeacherLoginRoutes from './routes/TeacherLoginRoutes.js'
import StudentLoginRoutes from './routes/StudentLoginRoutes.js'
import availableCoursesRoutes from './routes/availableCoursesRoutes.js';
import availableReEnrollCoursesRoutes from "./routes/availableReEnrollCoursesRoutes.js"
import attendanceRoutes from "./routes/attendanceRoutes.js"
import marksRoutes from './routes/marksRoutes.js';
import courseContentsRoutes from './routes/courseContentsRoutes.js';
import timetableRoutes from './routes/timetableRoutes.js';
import challanRoutes from './routes/challanRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import ProfilePictureRoutes from './routes/ProfilePictureRoutes.js';
import ManageSemester from './routes/ManageSemesterRoutes.js';
import resultCardRoutes from './routes/resultCardRoutes.js'
import MainAdminRoutes from './routes/MainAdminRoutes.js'
import CoordinatorRoutes from './routes/CoordinatorRoutes.js'

import MainAdminConrollerRoutes from './routes/MainAdminConrollerRoutes.js'
import HistoryRoutes from './routes/HistoryRoutes.js'

dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' })); // Adjust the limit as necessary
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Adjust the limit as necessary

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/teacherLogin', TeacherLoginRoutes);
app.use('/api/studentLogin', StudentLoginRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/profile", ProfilePictureRoutes);
app.use('/api/available-courses', availableCoursesRoutes);
app.use('/api/available-ReEnroll-courses', availableReEnrollCoursesRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/courseContents', courseContentsRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/challan', challanRoutes);
app.use('/api/assignment', assignmentRoutes);
app.use('/api/semester', ManageSemester);
app.use('/api/resultCard', resultCardRoutes);
app.use('/api/MainAdmin', MainAdminRoutes);
app.use('/api/CoordinatorRoutes', CoordinatorRoutes);
app.use('/api/MainAdminConrollerRoutes', MainAdminConrollerRoutes);
app.use('/api/HistoryRoutes', HistoryRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
