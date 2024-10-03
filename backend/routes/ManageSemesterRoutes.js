// routes/attendanceRoutes.js
import { Router } from 'express';
import { AddSemester,getOngoingSemester,getSemester} from '../controllers/ManageSemesterContoller.js';

const router = Router();

router.post('/add', AddSemester);
router.post('/get', getSemester);
router.post('/getongoingSemester', getOngoingSemester);

export default router;
