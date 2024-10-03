import express from "express";
import { uploadData, getTimetableDetails, getTimetableFile } from "../controllers/TimetableController.js";

const router = express.Router();

router.post("/upload", uploadData);
router.post("/getTimetableDetails", getTimetableDetails);
router.post("/getTimetableFile", getTimetableFile);

export default router;
