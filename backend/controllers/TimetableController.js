import Timetable from "../models/Timetable.js";

import Student from "../models/Student.js";
import sendPushNotification from "../utils/sendPushNotification.js";

export const uploadData = async (req, res) => {
  try {
    const { program, title,fileData, fileName, mimeType } = req.body;
    console.log(title);
    const newTimetable = new Timetable({
      fileData,
      fileName,
      mimeType,
      program,
      title,
      uploadDate: new Date(),
    });
    await newTimetable.save();

    const students = await Student.find({ program });
    const notificationPromises = students.map((student) => {
      return sendPushNotification(
        student.expoPushToken,
        "New Timetable Available",
        "A new timetable has been uploaded."
      );
    });

    await Promise.all(notificationPromises);

    res.status(201).json({
      message: "File and data uploaded successfully, notifications sent.",
      content: newTimetable,
    });
  } catch (error) {
    console.error("Error uploading file and data:", error);
    res.status(500).json({
      message: "Failed to upload file and data",
      error: error.message,
    });
  }
};

// Fetch timetable details
export const getTimetableDetails = async (req, res) => {
  const { program } = req.body;
  if (!program) {
    return res.status(400).json({ error: "Program is required" });
  }
  try {
    const timetables = await Timetable.find(
      { program },
      "fileName program title uploadDate"
    );
    if (timetables.length === 0) {
      return res.status(404).json({ message: "Timetable not found" });
    }
    res.status(200).json(timetables);
  } catch (error) {
    console.error("Error fetching timetable details:", error);
    res.status(500).json({
      message: "Failed to fetch timetable details",
      error: error.message,
    });
  }
};

// Fetch timetable file data
export const getTimetableFile = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Timetable ID is required" });
  }
  try {
    const timetable = await Timetable.findById(
      id,
      "fileData fileName mimeType"
    );
    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }
    res.status(200).json(timetable);
  } catch (error) {
    console.error("Error fetching timetable file:", error);
    res.status(500).json({
      message: "Failed to fetch timetable file",
      error: error.message,
    });
  }
};
