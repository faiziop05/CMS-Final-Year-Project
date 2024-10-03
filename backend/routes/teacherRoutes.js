import express from 'express';
import {
  getTeachers,
  addTeacher,
  updateTeacher,
  deleteTeacher,
  assignCourse,
  unassignCourse,
  getTeacherById,
  getTeacherById1,
  updateProfile
} from '../controllers/teacherController.js';

const router = express.Router();
router.get('/:id', getTeacherById);
router.get('/get/:id', getTeacherById1);
router.post('/get', getTeachers);
router.post('/', addTeacher);
router.put('/:id', updateTeacher);
router.put('/updateTeacherProfile/:id', updateProfile); 
router.delete('/:id', deleteTeacher);
router.post('/assign-course', assignCourse);
router.post('/unassign-course', unassignCourse);

export default router;
