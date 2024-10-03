// routes/authRoutes.js
import express from 'express';
const router = express.Router();
import { login } from '../controllers/MainAdminLogin.js';


router.post('/login', login);

export default router;
