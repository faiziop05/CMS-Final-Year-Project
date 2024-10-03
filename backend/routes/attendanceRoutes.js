// routes/attendanceRoutes.js
import { Router } from 'express';
import { addAttendance, getAttendance,updateAttendance ,getAttendancebyID,getAttendanceByStudentId, getAttendanceHistory} from '../controllers/attendanceController.js';

const router = Router();

router.post('/add', addAttendance);
router.post('/get', getAttendance);
router.post('/getAttendanceHistory', getAttendanceHistory);
router.post('/getAttendancebyID', getAttendancebyID);
router.post('/update', updateAttendance);
router.post('/getByStudentId', getAttendanceByStudentId);

export default router;
