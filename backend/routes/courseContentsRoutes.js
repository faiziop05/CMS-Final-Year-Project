import express from "express";
import { uploadData, getCourseContentDetails, getCourseContentFile, deleteCourseContent } from "../controllers/courseContentsController.js";

const router = express.Router();

router.post("/uploadData", uploadData);
router.post("/getContentDetails", getCourseContentDetails);
router.post("/getContentFile", getCourseContentFile);
router.post("/deleteContent", deleteCourseContent);
export default router;
