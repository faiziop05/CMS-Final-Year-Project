// controllers/marksController.js
import Marks from "../models/Marks.js";
import mongoose from "mongoose";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import sendPushNotification from "../utils/sendPushNotification.js";
import Course from "../models/Course.js";
export const saveMarks = async (req, res) => {
  try {
    const marksData = req.body;
    const notUploadedStudents = [];

    const promises = marksData.map(async (data) => {
      const { RegNum, courseId, marksType, studentId } = data;

      if (marksType === "Final Term") {
        // Fetch attendance records for the student in the given course and session
        const attendanceRecords = await Attendance.find({
          studentId,
          courseId,
          session: data.session,
        });

        const totalClasses = attendanceRecords.length;
        const attendedClasses = attendanceRecords.filter(
          (record) => record.isChecked
        ).length;
        const attendancePercentage = (attendedClasses / totalClasses) * 100;

        // if (totalClasses < 30 || attendancePercentage < 75) {
        //   console.log(`Student ${RegNum} does not meet the attendance requirements for final term marks`);
        //   notUploadedStudents.push(RegNum); // Add student to not uploaded list
        //   return null; // Skip this student's marks
        // }
      }

      const existingRecord = await Marks.findOne({
        RegNum,
        courseId,
        marksType,
      });

      if (existingRecord) {
        // Update the existing record
        return Marks.updateOne({ RegNum, courseId, marksType }, data);
      } else {
        // Create a new record
        const newMarks = new Marks(data);
        return newMarks.save();
      }
    });

    // Filter out null values (students who did not meet attendance requirements)
    const filteredPromises = promises.filter((promise) => promise !== null);

    await Promise.all(filteredPromises);

    const program = marksData[0].program;
    const session = marksData[0].session;
    const marksType = marksData[0].marksType;
    const students = await Student.find({ program, session });

    const notificationPromises = students.map((student) => {
      return sendPushNotification(
        student.expoPushToken,
        "Subject Marks",
        `New ${marksType} marks are uploaded.`
      );
    });

    await Promise.all(notificationPromises);

    res.status(200).json({
      message: "Marks saved successfully",
      notUploadedStudents,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving marks", error: error.message });
  }
};

export const updateMarks = async (req, res) => {
  try {
    const updatedMarksData = req.body;

    for (const marksEntry of updatedMarksData) {
      // Find the marks document based on studentId, marksType, and courseId
      // console.log(marksEntry);
      const filter = {
        studentId: new mongoose.Types.ObjectId(marksEntry.studentId),
        marksType: marksEntry.marksType,
        courseId: new mongoose.Types.ObjectId(marksEntry.courseId),
      };
      // Check if the document exists
      const existingMarks = await Marks.findOne(filter);

      if (existingMarks) {
        // Update the Marks and Totalmarks fields for the found document
        await Marks.findOneAndUpdate(filter, {
          Marks: marksEntry.marks,
          Totalmarks: marksEntry.totalMarks,
        });
      } else {
        // If the document doesn't exist, skip updating
        console.log(
          `No document found for studentId: ${marksEntry.studentId}, marksType: ${marksEntry.marksType}`
        );
      }
    }

    res.status(200).json({ message: "Marks updated successfully" });
  } catch (error) {
    console.error("Error updating marks:", error);
    res.status(500).json({ message: "Error updating marks", error });
  }
};

export const getMarks = async (req, res) => {
  const { program, session, courseId } = req.body;
  if (!courseId || !session || !program) {
    return res
      .status(400)
      .json({ error: "courseId, session, and program are required" });
  }

  try {
    const marksData = await Marks.find({
      courseId: new mongoose.Types.ObjectId(courseId),
      session,
      program,
    });

    // Group marks data by marksType
    const groupedData = {};
    marksData.forEach((student) => {
      const { marksType } = student;
      if (!groupedData[marksType]) {
        groupedData[marksType] = {};
      }
      groupedData[marksType][student.RegNum] = {
        RegNum: student.RegNum,
        StudentName: student.StudentName,
        Marks: student.Marks, // Ensure that Marks is an object
        marksType: student.marksType,
        session: student.session,
        program: student.program,
        studentId: student.studentId,
        courseId: student.courseId,
        Date: student.Date,
      };
    });

    res.status(200).json(groupedData);
  } catch (error) {
    console.error("Error fetching marks data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMarksbyId = async (req, res) => {
  const { studentId, courseId } = req.body;
  console.log(studentId, courseId);
  if (!courseId || !studentId) {
    return res
      .status(400)
      .json({ error: "courseId, session, and program are required" });
  }

  try {
    const marksData = await Marks.find({
      courseId: new mongoose.Types.ObjectId(courseId),
      studentId: new mongoose.Types.ObjectId(studentId),
    });

    res.status(200).json(marksData);
  } catch (error) {
    console.error("Error fetching marks data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFinalTermCoursesByStudentId = async (req, res) => {
  const { studentId } = req.body;

  if (!studentId) {
    return res.status(400).json({ error: "studentId is required" });
  }
  try {
    const finalTermCourses = await Marks.find({
      studentId: new mongoose.Types.ObjectId(studentId),
      marksType: "Final Term",
    })
      .select("courseId")
      .populate("courseId", "courseName");

    const courses = finalTermCourses.map((course) => ({
      courseId: course.courseId._id,
      courseName: course.courseId.courseName,
    }));

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching final term courses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getStudentsHistory = async (req, res) => {
  try {
    const { courseId, program, session, teacherId } = req.body;
    const filter = {};
    if (program) filter.program = program;
    if (session) filter.session = session;
    if (courseId) filter.courseId = courseId;
    if (teacherId) filter.teacherId = teacherId;

    const students = await Marks.find(filter);
    if (!students || students.length === 0) {
      return res.status(404).json({ msg: "No students found" });
    }

    const uniqueStudents = {};
    const studentHistory = [];

    students.forEach(student => {
      if (!uniqueStudents[student.studentId]) {
        uniqueStudents[student.studentId] = true;
        studentHistory.push({
          studentId: student.studentId,
          RegNum: student.RegNum,
          studentName: student.StudentName,
        });
      }
    });

    // Sort the studentHistory array by RegNum
    studentHistory.sort((a, b) => a.RegNum.localeCompare(b.RegNum));

    res.json(studentHistory);
  } catch (err) {
    res.status(500).send("Server error");
  }
};



export { getStudentsHistory };
export const getMarksStudentHistory = async (req, res) => {
  const { courseId, program, session, teacherId, studentId } = req.body;
  const filter = {};
  if (program) filter.program = program;
  if (session) filter.session = session;
  if (courseId) filter.courseId = courseId;
  if (teacherId) filter.teacherId = teacherId;
  if (studentId) filter.studentId = studentId;
  
  try {
    const marksData = await Marks.find(filter);

    // Convert the marks data into an array of objects
    const result = marksData.map((student) => ({
      RegNum: student.RegNum,
      StudentName: student.StudentName,
      Marks: student.Marks,
      marksType: student.marksType,
      session: student.session,
      program: student.program,
      studentId: student.studentId,
      courseId: student.courseId,
      Date: student.Date,
      TotalMarks:student.TotalMarks
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching marks data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

