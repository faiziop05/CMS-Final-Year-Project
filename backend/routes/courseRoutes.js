// routes/courseRoutes.js
import express from 'express';
import {
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse
} from '../controllers/courseController.js';

const router = express.Router();

router.post('/get', getCourses);
router.post('/', addCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

export default router;
