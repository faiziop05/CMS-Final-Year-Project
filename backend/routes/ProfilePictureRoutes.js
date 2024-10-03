import express from 'express';
import { getProfilePicture, uploadProfilePicture } from '../controllers/profilePictureController.js';
import upload from "../utils/upload.js"



const router = express.Router();
router.post('/uploadprofile', upload.single('file'), uploadProfilePicture);
router.get('/getprofilepicture/:userId', getProfilePicture);

export default router;
