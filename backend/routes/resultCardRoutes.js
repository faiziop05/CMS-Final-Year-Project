import express from 'express';
import {
  getAllResultCardsByStudent,
  getCGPAByStudent
} from '../controllers/calculateResultContoller.js';

const router = express.Router();
router.get('/get/:studentId', getAllResultCardsByStudent);
router.get('/getCGPAByStudent/:studentId', getCGPAByStudent);

export default router;
