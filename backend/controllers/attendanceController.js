// controllers/attendanceController.js
import Attendance from "../models/Attendance.js";
import Course from "../models/Course.js";
import Student from "../models/Student.js";
import sendPushNotification from "../utils/sendPushNotification.js";
export const addAttendance = async (req, res) => {
  try {
    const attendanceData = req.body;
    const session = attendanceData[0].session;
    const program = attendanceData[0].program;
    const result = await Attendance.insertMany(attendanceData);

    const students = await Student.find({ program, session });
    const notificationPromises = students.map((student) => {
      return sendPushNotification(
        student.expoPushToken,
        "Attendance",
        "A new Attendance has been uploaded."
      );
    });

    await Promise.all(notificationPromises);

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error adding attendance", error });
  }
};

export const getAttendance = async (req, res) => {
  try {
    const { program, session, courseId } = req.body;

    const filter = {};
    if (program) filter.program = program;
    if (session) filter.session = session;
    if (courseId) filter.courseId = courseId;

    const attendance = await Attendance.find(filter);

    if (attendance.length === 0) {
      return res
        .status(404)
        .json({
          message: "No attendance records found for the specified criteria.",
        });
    }

    const transformedData = attendance.reduce((acc, curr) => {
      const existingClass = acc.find(
        (item) => item.title === curr.title && item.date === curr.date
      );
      if (existingClass) {
        existingClass.attendanceData.push({
          RegNum: curr.RegNum,
          StudentName: curr.StudentName,
          isChecked: curr.isChecked,
          studentId: curr.studentId,
        });
      } else {
        acc.push({
          class: curr.class,
          classType: curr.classType,
          date: curr.date,
          startTime: curr.startTime,
          endTime: curr.endTime,
          title: curr.title,
          courseId: curr.courseId,
          session: curr.session,
          program: curr.program,
          attendanceData: [
            {
              RegNum: curr.RegNum,
              StudentName: curr.StudentName,
              isChecked: curr.isChecked,
              studentId: curr.studentId,
            },
          ],
        });
      }
      return acc;
    }, []);

    console.log("Transformed Data:", transformedData.attendanceData);
    res.status(200).json(transformedData);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Error fetching attendance", error });
  }
};

export const getAttendanceByStudentId = async (req, res) => {
  try {
    const { studentId, courseIds } = req.body;

    // Ensure the courseIds is an array
    if (!Array.isArray(courseIds)) {
      return res.status(400).json({ message: "courseIds must be an array" });
    }

    const attendance = await Attendance.find({
      studentId,
      courseId: { $in: courseIds },
    });

    if (attendance.length === 0) {
      return res
        .status(404)
        .json({
          message: "No attendance records found for the specified criteria.",
        });
    }

    res.status(200).json(attendance);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Error fetching attendance", error });
  }
};

export const getAttendancebyID = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    // Create filter object based on studentId and courseId
    const filter = {};
    if (studentId) filter.studentId = studentId;
    if (courseId) filter.courseId = courseId;

    // Fetch attendance data from the database
    const attendance = await Attendance.find(filter);

    if (attendance.length === 0) {
      return res
        .status(404)
        .json({
          message: "No attendance records found for the specified criteria.",
        });
    }

    // Fetch course data from the database
    const course = await Course.findOne({ _id: courseId });

    if (!course) {
      return res
        .status(404)
        .json({ message: "No course found for the specified criteria." });
    }

    // Transform the data
    const transformedData = attendance.reduce((acc, curr) => {
      const existingClass = acc.find(
        (item) => item.title === curr.title && item.date === curr.date
      );
      if (existingClass) {
        existingClass.attendanceData.push({
          RegNum: curr.RegNum,
          StudentName: curr.StudentName,
          isChecked: curr.isChecked,
          class: curr.class,
          date: curr.date,
          title: curr.title,
        });
      } else {
        acc.push({
          courseId: curr.courseId,
          attendanceData: [
            {
              date: curr.date,
              title: curr.title,
              isChecked: curr.isChecked,
              class: curr.class,
              courseName: course.courseName,
              courseCode: course.courseCode,
              creditHours: course.creditHours,
            },
          ],
        });
      }
      return acc;
    }, []);

    res.status(200).json(transformedData);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Error fetching attendance", error });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const updatedAttendanceData = req.body;

    for (const attendance of updatedAttendanceData) {
      // Find the attendance document based on studentId, date, and title
      const filter = {
        studentId: attendance.studentId,
        date: attendance.date,
        title: attendance.title,
      };

      // Update the isChecked field for the found attendance document
      await Attendance.findOneAndUpdate(filter, {
        isChecked: attendance.isChecked,
      });
    }

    res.status(200).json({ message: "Attendance updated successfully" });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ message: "Error updating attendance", error });
  }
};

export const getAttendanceHistory = async (req, res) => {
  try {
    const { courseId, program, session, teacherId } = req.body;

    const filter = {};
    if (program) filter.program = program;
    if (session) filter.session = session;
    if (courseId) filter.courseId = courseId;
    if (teacherId) filter.teacherId = teacherId;

    const attendance = await Attendance.find(filter);

    if (attendance.length === 0) {
      return res
        .status(404)
        .json({
          message: "No attendance records found for the specified criteria.",
        });
    }

    const transformedData = attendance.reduce((acc, curr) => {
      const existingClass = acc.find(
        (item) => item.title === curr.title && item.date === curr.date
      );
      if (existingClass) {
        existingClass.attendanceData.push({
          RegNum: curr.RegNum,
          StudentName: curr.StudentName,
          isChecked: curr.isChecked,
          studentId: curr.studentId,
        });
      } else {
        acc.push({
          class: curr.class,
          classType: curr.classType,
          date: curr.date,
          startTime: curr.startTime,
          endTime: curr.endTime,
          title: curr.title,
          courseId: curr.courseId,
          session: curr.session,
          program: curr.program,
          attendanceData: [
            {
              RegNum: curr.RegNum,
              StudentName: curr.StudentName,
              isChecked: curr.isChecked,
              studentId: curr.studentId,
            },
          ],
        });
      }
      return acc;
    }, []);
    
   
    console.log("Transformed Data:", transformedData.attendanceData);
    res.status(200).json(transformedData);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Error fetching attendance", error });
  }
};
