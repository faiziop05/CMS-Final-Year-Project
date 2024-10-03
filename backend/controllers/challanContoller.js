import Challan from "../models/Challan.js"
import Student from "../models/Student.js";
import sendPushNotification from "../utils/sendPushNotification.js";


// Backend: Store the file along with MIME type and original filename
export const uploadChallan = async (req, res) => {
    try {
      const {  program,session,semester, fileData, fileName, mimeType } = req.body;

      const newChallan = new Challan({
        fileData, // Store the base64 file data
        fileName, // Store the original filename
        mimeType, // Store the MIME type
        program,
        session,
        semester,
        uploadDate: new Date(),
      });
  
      await newChallan.save();
      const students = await Student.find({ program,session ,semester});
      const notificationPromises = students.map((student) => {
        return sendPushNotification(
          student.expoPushToken,
          "New Challan Available",
          "New Challan is Uploaded."
        );
      });
  
      await Promise.all(notificationPromises);
  
  
      res.status(201).json({
        message: "File and data uploaded successfully",
        content: newChallan,
      });
    } catch (error) {
      console.error("Error uploading file and data:", error);
      res.status(500).json({
        message: "Failed to upload file and data",
        error: error.message,
      });
    }
  };
  


  // Fetch challan details
  export const getChallanDetails = async (req, res) => {
    const { program, session, semester } = req.body;
    if (!program || !session || !semester) {
      return res.status(400).json({ error: "Program, session, and semester are required" });
    }
    try {
      const challans = await Challan.find(
        { program, session, semester },
        'fileName program session semester uploadDate status'
      );
      if (challans.length === 0) {
        return res.status(404).json({ message: "Challan not found" });
      }
      res.status(200).json(challans);
    } catch (error) {
      console.error("Error fetching challan details:", error);
      res.status(500).json({
        message: "Failed to fetch challan details",
        error: error.message,
      });
    }
  };
  
  // Fetch challan file data
  export const getChallanFile = async (req, res) => {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Challan ID is required" });
    }
    try {
      const challan = await Challan.findById(id, 'fileData fileName mimeType');
      if (!challan) {
        return res.status(404).json({ message: "Challan not found" });
      }
      res.status(200).json(challan);
    } catch (error) {
      console.error("Error fetching challan file:", error);
      res.status(500).json({
        message: "Failed to fetch challan file",
        error: error.message,
      });
    }
  };
  