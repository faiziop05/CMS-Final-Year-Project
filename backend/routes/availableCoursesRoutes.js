// routes/availableCoursesRoutes.js
import express from 'express';
import { setAvailableCourses, getAvailableCourses,getSemesterAvailableCourses } from '../controllers/availableCoursesController.js';

const router = express.Router();

router.post('/CourseAvailableList', setAvailableCourses);
router.get('/get', getAvailableCourses);
router.post('/getSemesterCourses', getSemesterAvailableCourses);

export default router;
