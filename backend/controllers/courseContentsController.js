// In controllers/courseContentsController.js

import mongoose from "mongoose";
import CourseContent from "../models/CourseContent.js";

// Backend: Store the file along with MIME type and original filename
export const uploadData = async (req, res) => {
    try {
      const { title, description, courseId, session, program, fileData, fileName, mimeType } = req.body;
  
      const newCourseContent = new CourseContent({
        title,
        description,
        fileData, // Store the base64 file data
        fileName, // Store the original filename
        mimeType, // Store the MIME type
        courseId,
        session,
        program,
        uploadDate: new Date(),
      });
  
      await newCourseContent.save();
  
      res.status(201).json({
        message: "File and data uploaded successfully",
        content: newCourseContent,
      });
    } catch (error) {
      console.error("Error uploading file and data:", error);
      res.status(500).json({
        message: "Failed to upload file and data",
        error: error.message,
      });
    }
  };
  
  export const getCourseContentDetails = async (req, res) => {
    const { courseId, session, program } = req.body;
    if (!courseId || !session || !program) {
      return res
        .status(400)
        .json({ error: "courseId, session, and program are required" });
    }
    try {
      const courseContent = await CourseContent.find({
        courseId,
        session,
        program,
      }, 'title description fileName uploadDate');
  
      if (!courseContent) {
        return res.status(404).json({ message: "Course content not found" });
      }
      res.status(200).json(courseContent);
    } catch (error) {
      console.error("Error fetching course content:", error);
      res.status(500).json({
        message: "Failed to fetch course content",
        error: error.message,
      });
    }
  };
  
  // Fetch course content file
  export const getCourseContentFile = async (req, res) => {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Content ID is required" });
    }
    try {
      const courseContent = await CourseContent.findById(id, 'fileData fileName mimeType');
      if (!courseContent) {
        return res.status(404).json({ message: "Course content not found" });
      }
      res.status(200).json(courseContent);
    } catch (error) {
      console.error("Error fetching course content file:", error);
      res.status(500).json({
        message: "Failed to fetch course content file",
        error: error.message,
      });
    }
  };// Delete course content
  export const deleteCourseContent = async (req, res) => {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Content ID is required" });
    }
    try {
      const courseContent = await CourseContent.findByIdAndDelete(id);
      if (!courseContent) {
        return res.status(404).json({ message: "Course content not found" });
      }
      res.status(200).json({ message: "Course content deleted successfully" });
    } catch (error) {
      console.error("Error deleting course content:", error);
      res.status(500).json({
        message: "Failed to delete course content",
        error: error.message,
      });
    }
  };
  