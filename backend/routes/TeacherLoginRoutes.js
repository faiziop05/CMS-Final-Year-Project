// routes/authRoutes.js
import express from 'express';
const router = express.Router();
import { TeacherLogin } from '../controllers/TeacherLoginContoller.js';

router.post('/TeacherLogin', TeacherLogin);

export default router;
