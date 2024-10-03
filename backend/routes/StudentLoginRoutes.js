// routes/authRoutes.js
import express from 'express';
const router = express.Router();
import { StudentloginController } from '../controllers/StudentLoginConroller.js';

router.post('/Studentlogin', StudentloginController);

export default router;
