import Assignment from "../models/Assignment.js";
import Course from "../models/Course.js";
import CompletedAssignment from "../models/CompletedAssignments.js";
import Student from "../models/Student.js";
import sendPushNotification from "../utils/sendPushNotification.js";
import fs from 'fs';
import path from 'path';
import multer from "multer";

export const uploadCAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      program,
      session,
      semester,
      courseId,
      fileData,
      fileName,
      mimeType,
      deadline,
      status
    } = req.body;

    // Fetch the course title using courseId
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const newAssignment = new Assignment({
      fileData, // Store the base64 file data
      fileName, // Store the original filename
      mimeType, // Store the MIME type
      program,
      session,
      semester,
      description,
      title,
      courseId,
      deadline,
      status,
      courseTitle: course.courseName, // Assuming course has a 'title' field
      uploadDate: new Date(),
    });

    await newAssignment.save();

    const students = await Student.find({ program,session,semester });
    const notificationPromises = students.map((student) => {
      return sendPushNotification(
        student.expoPushToken,
        "New Assignment available",
        "A new Assignment has been uploaded."
      );
    });

    await Promise.all(notificationPromises);


    res.status(201).json({
      message: "File and data uploaded successfully",
      content: newAssignment,
    });
  } catch (error) {
    console.error("Error uploading file and data:", error);
    res.status(500).json({
      message: "Failed to upload file and data",
      error: error.message,
    });
  }
};


const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
}).single('file');

export const uploadCompletedAssignment = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'Multer error: ' + err.message });
      }
      const {
        program,
        session,
        semester,
        courseId,
        status,
        id,
        rollNo
      } = req.body;
      // Log the request body to see field sizes
      console.log('Request body:', req.body);
      
      
      // Fetch the course title using courseId
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      // Convert file buffer to base64
      const fileData = req.file.buffer.toString('base64');
      // const fileName = req.file.name;
      const fileName = req.file.originalname; // Use 'originalname'
      const mimeType = req.file.mimetype; // Use 'mimetype'
          
      // Create a new CompletedAssignment
      const newAssignment = new CompletedAssignment({
        fileData, // Store the base64 file data
        fileName, // Store the original filename
        mimeType, // Store the MIME type
        program,
        session,
        semester,
        courseId,
        status,
        rollNo,
        courseTitle: course.courseName, // Assuming course has a 'courseName' field
        uploadDate: new Date(),
      });

      await newAssignment.save();

      res.status(201).json({
        message: 'File and data uploaded successfully',
        content: newAssignment,
      });
    });
  } catch (error) {
    console.error('Error uploading file and data:', error);
    res.status(500).json({
      message: 'Failed to upload file and data',
      error: error.message,
    });
  }
};




export const getAssignment = async (req, res) => {
  const { program, session, semester,courseId } = req.body;
  if (!program || !session || !semester  ) {
    return res.status(400).json({ error: "Program,session or semester is required" });
  }
  try {
    const assignments = await Assignment.find({ program, session, semester,courseId });

    if (assignments.length === 0) {
      return res.status(404).json({ message: "Assignments not found" });
    }
    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching Assignments:", error);
    res.status(500).json({
      message: "Failed to fetch Assignments",
      error: error.message,
    });
  }
};
// In assignmentController.js
export const getAssignmentDetails = async (req, res) => {
  const { program, session, semester } = req.body;
  if (!program || !session || !semester) {
    return res.status(400).json({ error: "Program, session, or semester is required" });
  }
  try {
    const assignments = await Assignment.find({ program, session, semester }).select('-fileData -fileName -mimeType');
    if (assignments.length === 0) {
      return res.status(404).json({ message: "Assignments not found" });
    }
    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching Assignments:", error);
    res.status(500).json({
      message: "Failed to fetch Assignments",
      error: error.message,
    });
  }
};

export const getAssignmentFile = async (req, res) => {
  const { id } = req.params;
  try {
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.status(200).json({ fileData: assignment.fileData, fileName: assignment.fileName, mimeType: assignment.mimeType });
  } catch (error) {
    console.error("Error fetching assignment file:", error);
    res.status(500).json({
      message: "Failed to fetch assignment file",
      error: error.message,
    });
  }
};

export const getCompletedAssignment = async (req, res) => {
  const { program, session, semester ,courseId } = req.body;
  if (!program || !session || !semester || !courseId ) {
    return res.status(400).json({ error: "Program,session,coursrId or semester is required" });
  }
  try {
    const assignments = await CompletedAssignment.find({ program, session, semester,courseId });

    if (assignments.length === 0) {
      return res.status(404).json({ message: "Assignments not found" });
    }
    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching Assignments:", error);
    res.status(500).json({
      message: "Failed to fetch Assignments",
      error: error.message,
    });
  }
};
// In assignmentController.js

export const deleteAssignment = async (req, res) => {
  const { id } = req.params;

  try {
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    await Assignment.findByIdAndDelete(id); // Use findByIdAndDelete to remove the document
    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    res.status(500).json({
      message: "Failed to delete assignment",
      error: error.message,
    });
  }
};


// controllers/assignmentController.js

export const getAssignmentDetails1 = async (req, res) => {
  const { courseId, session, program } = req.body;
  if (!courseId || !session || !program) {
    return res
      .status(400)
      .json({ error: "courseId, session, and program are required" });
  }
  try {
    const assignments = await Assignment.find({
      courseId,
      session,
      program,
    }, 'title description deadline fileName uploadDate');
  
    if (!assignments) {
      return res.status(404).json({ message: "Assignments not found" });
    }
    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({
      message: "Failed to fetch assignments",
      error: error.message,
    });
  }
};

export const getAssignmentFile1 = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Assignment ID is required" });
  }
  try {
    const assignment = await Assignment.findById(id, 'fileData fileName mimeType');
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.status(200).json(assignment);
  } catch (error) {
    console.error("Error fetching assignment file:", error);
    res.status(500).json({
      message: "Failed to fetch assignment file",
      error: error.message,
    });
  }
};

export const getCompletedAssignmentDetails = async (req, res) => {
  const { courseId, session, program } = req.body;
  if (!courseId || !session || !program) {
    return res
      .status(400)
      .json({ error: "courseId, session, and program are required" });
  }
  try {
    const completedAssignments = await CompletedAssignment.find({
      courseId,
      session,
      program,
    }, 'rollNo uploadDate fileName');
  
    if (!completedAssignments) {
      return res.status(404).json({ message: "Completed assignments not found" });
    }
    res.status(200).json(completedAssignments);
  } catch (error) {
    console.error("Error fetching completed assignments:", error);
    res.status(500).json({
      message: "Failed to fetch completed assignments",
      error: error.message,
    });
  }
};

export const getCompletedAssignmentFile = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Completed Assignment ID is required" });
  }
  try {
    const completedAssignment = await CompletedAssignment.findById(id, 'fileData fileName mimeType');
    if (!completedAssignment) {
      return res.status(404).json({ message: "Completed assignment not found" });
    }
    res.status(200).json(completedAssignment);
  } catch (error) {
    console.error("Error fetching completed assignment file:", error);
    res.status(500).json({
      message: "Failed to fetch completed assignment file",
      error: error.message,
    });
  }
};
