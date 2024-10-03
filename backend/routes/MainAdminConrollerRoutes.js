import express from 'express';
import {
  updateAdminProfile,
  getAdminById
} from '../controllers/MainAdminConroller.js';


const router = express.Router();

router.get('/get/:id', getAdminById); // Add the new route
router.put('/updateAdminProfile/:id', updateAdminProfile); // Add the new route


export default router;
