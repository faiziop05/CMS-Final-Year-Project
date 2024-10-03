import Student from "../models/Student.js";
import Course from "../models/Course.js";
import Teacher from "../models/Teacher.js";
import mongoose from "mongoose";
import StudentLogin from "../models/StudentLogin.js";
import sendPushNotification from "../utils/sendPushNotification.js";

// Other functions...

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }
    res.json({
      session: student.session,
      program: student.program,
      semester: student.semester,
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

export { getStudentById };

const getStudentDataById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

export { getStudentDataById };

// Get all students
export const getAllStudents = async (req, res) => {
  const {program,session}=req.body
  try {
    const students = await Student.find({program,session});
    res.json(students);
  } catch (error) {
    res.status(500).send("Error fetching students: " + error.message);
  }
};
export const getbyprogramandsession = async (req, res) => {
  const {program,session}=req.body
  try {
    const students = await Student.find({program,session});
students.sort((a, b) => a.username.localeCompare(b.username));
    
    res.json(students);
  } catch (error) {
    res.status(500).send("Error fetching students: " + error.message);
  }
};

export const getStudentsByCourseId = async (req, res) => {
  const { courseId } = req.params;
  const { session, program } = req.query; // Get session and program from query parameters
  try {
    const objectId = new mongoose.Types.ObjectId(courseId);

    // Log the converted ObjectId and query parameters
    console.log(
      `Fetching students for courseId: ${objectId}, session: ${session}, program: ${program}`
    );

    const students = await Student.find({
      "Assignedcourses.courseId": objectId,
      session: session,
      program: program,
    });
  students.sort((a, b) => a.username.localeCompare(b.username));
    // Log the result of the query
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Enroll students
export const enrollStudents = async (req, res) => {
  const { session, program, registeredStudents,programSemesters } = req.body;

  try {
    const studentsToEnroll = registeredStudents.map((student) => ({
      ...student,
      session,
      program,
      programSemesters,
      semester: 1,
      expoPushToken: student.expoPushToken || null, // Include expoPushToken if provided
    }));

    await Student.insertMany(studentsToEnroll);
    res.status(200).send("Students enrolled successfully");
  } catch (error) {
    res.status(500).send("Error enrolling students: " + error.message);
  }
};

// Get students by session and program
export const getStudentsBySessionAndProgram = async (req, res) => {
  const { session, program } = req.query;
  try {
    const students = await Student.find({ session, program });
    res.json(students);
  } catch (error) {
    res.status(500).send("Error fetching students: " + error.message);
  }
};
export const getStudentsBySessionAndProgramAndSemster = async (req, res) => {
  const { Registeredprogram, Registeredsession, semester } = req.body;
  try {
    const students = await Student.find({
      program: Registeredprogram,
      session: Registeredsession,
      semester: semester,
    });
    students.sort((a, b) => a.username.localeCompare(b.username));
    res.json(students);
  } catch (error) {
    res.status(500).send("Error fetching students: " + error.message);
  }
};

// Assign courses to students
export const assignCoursesToStudents = async (req, res) => {
  const { session, program, semester, courseIds } = req.body;

  if (!session || !program || !courseIds || !Array.isArray(courseIds)) {
    return res.status(400).json({ message: "Invalid data format" });
  }

  try {
    // Convert courseIds to ObjectId using the new keyword
    const objectIdCourseIds = courseIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const courses = await Course.find({ _id: { $in: objectIdCourseIds } });
    if (courses.length !== courseIds.length) {
      return res.status(404).json({ message: "One or more courses not found" });
    }

    // Fetch only students matching the session and program
    const students = await Student.find({ session, program });

    const teachers = await Teacher.find({
      "Assignedcourses.courseId": { $in: objectIdCourseIds },
    });
    if (teachers.length === 0) {
      return res
        .status(404)
        .json({ message: "No teachers found for the provided course IDs" });
    }

    for (let student of students) {
      for (let courseId of objectIdCourseIds) {
        const course = courses.find((c) => c._id.equals(courseId));
        const teacher = teachers.find((t) =>
          t.Assignedcourses.some((ac) => ac.courseId.equals(courseId))
        );

        if (course && teacher) {
          if (
            !student.Assignedcourses.some((ac) => ac.courseId.equals(courseId))
          ) {
            student.Assignedcourses.push({
              courseId: course._id,
              courseName: course.courseName,
              courseCode: course.courseCode,
              teacherId: teacher._id,
              teacherName: teacher.fullName,
            });
          }
        }
      }
    }

    await Promise.all(students.map((student) => student.save()));

    res.status(201).json({
      message: "Courses and teachers assigned successfully to students",
      students,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error assigning courses: " + error.message });
  }
};

// Unassign course from students
export const unassignCourse = async (req, res) => {
  const { session, program, courseId } = req.body;

  if (!session || !program || !courseId) {
    return res.status(400).json({ message: "Invalid data format" });
  }

  try {
    const students = await Student.find({ session, program });
    students.forEach((student) => {
      student.Assignedcourses = student.Assignedcourses.filter(
        (ac) => ac.courseId.toString() !== courseId
      );
    });

    await Promise.all(students.map((student) => student.save()));

    res
      .status(200)
      .json({ message: "Course unassigned successfully from students" });
  } catch (error) {
    res.status(500).send("Error unassigning course: " + error.message);
  }
};

// Get students by session and program
export const getStudents = async (req, res) => {
  const { session, program } = req.query;
  try {
    const students = await Student.find({ session, program });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).send("Error fetching students: " + error.message);
  }
};

// Update student
export const updateStudent = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedStudent) {
      return res.status(404).send("Student not found");
    }
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).send("Error updating student: " + error.message);
  }
};

export const updateStudentProfile = async (req, res) => {
  const { id } = req.params;
  const { phoneNo, email, password, oldPassword } = req.body;

  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).send("Student not found");
    }

    // Validate old password
    if (oldPassword && student.password !== oldPassword) {
      return res.status(400).send("Old password does not match");
    }

    // Update fields
    if (phoneNo) student.phoneNo = phoneNo;
    if (email) student.email = email;
    if (password) student.password = password;
  

    const updatedStudent = await student.save();
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).send("Error updating student: " + error.message);
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) {
      return res.status(404).send("Student not found");
    }
    res.status(200).send("Student deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting student: " + error.message);
  }
};
// controllers/studentController.js
export const enrollCourses = async (req, res) => {
  const { studentId, courseIds } = req.body;

  if (!studentId || !courseIds || !Array.isArray(courseIds)) {
    return res.status(400).json({ message: "Invalid data format" });
  }

  try {
    // Validate and convert studentId to ObjectId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid student ID format" });
    }
    const studentObjectId = new mongoose.Types.ObjectId(studentId);

    // Validate and convert courseIds to ObjectId
    const objectIdCourseIds = courseIds.map((id) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid course ID format: ${id}`);
      }
      return new mongoose.Types.ObjectId(id);
    });

    const student = await Student.findById(studentObjectId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const courses = await Course.find({ _id: { $in: objectIdCourseIds } });
    if (courses.length !== courseIds.length) {
      return res.status(404).json({ message: "One or more courses not found" });
    }

    const teachers = await Teacher.find({
      "Assignedcourses.courseId": { $in: objectIdCourseIds },
    });
    if (teachers.length === 0) {
      return res
        .status(404)
        .json({ message: "No teachers found for the provided course IDs" });
    }

    // Calculate current total credit hours for the semester
    const currentCreditHours = student.Assignedcourses.reduce(
      (total, ac) => total + ac.creditHours,
      0
    );

    // Calculate total credit hours for the new courses
    const newCreditHours = courses.reduce(
      (total, course) => total + course.creditHours,
      0
    );

    // Check if the total credit hours after enrolling exceed 24
    if (currentCreditHours + newCreditHours > 24) {
      return res
        .status(400)
        .json({
          message: "Cannot enroll in courses. Total credit hours exceed 24.",
        });
    }

    courses.forEach((course) => {
      if (
        !student.Assignedcourses.some((ac) => ac.courseId.equals(course._id))
      ) {
        const teacher = teachers.find((t) =>
          t.Assignedcourses.some((ac) => ac.courseId.equals(course._id))
        );

        if (teacher) {
          student.Assignedcourses.push({
            courseId: course._id,
            courseName: course.courseName,
            courseCode: course.courseCode,
            creditHours: course.creditHours, // Assuming course schema has creditHours field
            teacherId: teacher._id,
            teacherName: teacher.fullName,
          });
        }
      }
    });

    await student.save();
    let _id = studentId;
    const students = await Student.find({ _id });
    const notificationPromises = students.map((student) => {
      return sendPushNotification(
        student.expoPushToken,
        "Course Enrollment",
        "Successfully Enrolled in Courses."
      );
    });

    await Promise.all(notificationPromises);

    res.status(201).json({ message: "Courses enrolled successfully", student });
  } catch (error) {
    if (error.message.includes("Invalid course ID format")) {
      return res.status(400).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "Error enrolling courses: " + error.message });
  }
};

// Function to save expoPushToken
export const saveExpoPushToken = async (req, res) => {
  const { studentId, expoPushToken } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    student.expoPushToken = expoPushToken;
    await student.save();

    res.status(200).json({ message: "Expo push token saved successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving expo push token: " + error.message });
  }
};
export const RemoveExpoPushToken = async (req, res) => {
  const { studentId } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    student.expoPushToken = '';
    await student.save();

    res.status(200).json({ message: "Expo push token saved successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving expo push token: " + error.message });
  }
};
