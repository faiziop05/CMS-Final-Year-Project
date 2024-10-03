import express from 'express';
import {
  getAllStudents,
  enrollStudents,
  getStudentsBySessionAndProgram,
  assignCoursesToStudents,
  unassignCourse,
  getStudents,
  updateStudent,
  deleteStudent,
  enrollCourses,
  getStudentById, // Import the new function
  getStudentDataById,
  getStudentsBySessionAndProgramAndSemster,
  updateStudentProfile,
  RemoveExpoPushToken,
  getbyprogramandsession
} from '../controllers/studentController.js';
import { getStudentsByCourseId } from '../controllers/studentController.js';


const router = express.Router();

router.post('/enroll', enrollCourses);
router.post("/batch", enrollStudents);
router.post("/RemoveExpoPushToken", RemoveExpoPushToken);
router.get("/", getAllStudents);
router.post("/program", getbyprogramandsession);
router.get("/by-session-program", getStudentsBySessionAndProgram);
router.post("/assign-courses", assignCoursesToStudents);
router.post("/unassign-course", unassignCourse);
router.get('/students', getStudents);
router.post('/students/semesterStudents', getStudentsBySessionAndProgramAndSemster);
router.post('/students/assign-courses', assignCoursesToStudents);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);
router.get('/students/by-course/:courseId', getStudentsByCourseId);
router.get('/students/:id', getStudentById); // Add the new route
router.get('/:id', getStudentDataById); // Add the new route
router.put('/updateStudentProfile/:id', updateStudentProfile); // Add the new route


export default router;
