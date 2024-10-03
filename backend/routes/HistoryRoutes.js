import express from 'express';
import { GetHistoryCourses } from "../controllers/HistoryContoller.js";

const router = express.Router();

router.post('/historyCourseName', GetHistoryCourses);
export default router;