// routes/courseRoutes.js
import express from "express";
import { uploadCAssignment,getAssignment,uploadCompletedAssignment ,getAssignmentDetails,getAssignmentFile,getCompletedAssignment,deleteAssignment, getAssignmentDetails1, getAssignmentFile1, getCompletedAssignmentDetails, getCompletedAssignmentFile} from "../controllers/assignmentContoller.js";

const router = express.Router();


router.post("/uploadAssignment", uploadCAssignment);
router.post("/getAssignment", getAssignment);
router.post("/getAssignmentDetails", getAssignmentDetails);
router.get("/getAssignmentFile/:id", getAssignmentFile);
router.post("/uploadCompletedAssignment", uploadCompletedAssignment);
router.post("/getCompletedAssignment", getCompletedAssignment);
router.delete("/deleteAssignment/:id", deleteAssignment);
router.post("/getAssignmentDetails1", getAssignmentDetails1);
router.post("/getAssignmentFile1", getAssignmentFile1);
router.post("/getCompletedAssignmentDetails", getCompletedAssignmentDetails);
router.post("/getCompletedAssignmentFile", getCompletedAssignmentFile);
export default router;
