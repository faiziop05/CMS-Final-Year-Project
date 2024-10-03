import express from "express";
import { uploadChallan, getChallanDetails, getChallanFile } from "../controllers/challanContoller.js";

const router = express.Router();

router.post("/uploadChallan", uploadChallan);
router.post("/getChallanDetails", getChallanDetails);
router.post("/getChallanFile", getChallanFile);

export default router;
