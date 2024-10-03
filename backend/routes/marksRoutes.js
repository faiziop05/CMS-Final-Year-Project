// routes/marks.js
import express from 'express';
import { saveMarks ,updateMarks,getMarks,getMarksbyId ,getFinalTermCoursesByStudentId, getStudentsHistory, getMarksStudentHistory} from '../controllers/marksController.js';

const router = express.Router();
router.post('/getFinalTermCoursesByStudentId', getFinalTermCoursesByStudentId);
router.post('/', saveMarks);
router.put('/marks', updateMarks);
router.post('/marks/get', getMarks);
router.post('/marks/getbyId', getMarksbyId);
router.post('/marks/getStudenthistory', getStudentsHistory);
router.post('/marks/getStudenthistoryStudent', getMarksStudentHistory);

export default router;
