
import express from 'express';
import { setAvailableCourses, getAvailableCourses,getSemesterAvailableCourses } from '../controllers/availableReEnrollCoursesController.js';

const router = express.Router();

router.post('/ReEnrollCourseAvailableList', setAvailableCourses);
router.post('/getSemesterCourses', getSemesterAvailableCourses);
router.get('/get', getAvailableCourses);

export default router;
