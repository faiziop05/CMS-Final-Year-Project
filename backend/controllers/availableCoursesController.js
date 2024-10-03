// controllers/availableCoursesController.js
import AvailableCourses from "../models/AvailableCourses.js";
import Student from "../models/Student.js";
import sendPushNotification from "../utils/sendPushNotification.js";
import Course from "../models/Course.js";
import ResultCard from "../models/ResultCard.js";
// Set available courses for a semester
export const setAvailableCourses = async (req, res) => {
  const { session, program, semester, courseIds } = req.body;

  if (
    !program ||
    !semester ||
    !courseIds ||
    !Array.isArray(courseIds)
  ) {
    return res.status(400).json({ message: "Invalid data format" });
  }

  try {
    // Check if a document with the same session, program, and semester already exists
    const existingCourses = await AvailableCourses.findOne({
      program,
      semester,
    });

    if (existingCourses) {
      // If the document exists, update the list of courses
      existingCourses.courses = courseIds;
      await existingCourses.save();
    } else {
      // If the document does not exist, create a new one
      await AvailableCourses.create({
        program,
        semester,
        courses: courseIds,
      });
    }
    const students = await Student.find({ program, session, semester });
    const notificationPromises = students.map((student) => {
      return sendPushNotification(
        student.expoPushToken,
        "New Courses",
        "New Courses are available to Enroll."
      );
    });

    await Promise.all(notificationPromises);

    res.status(200).json({ message: "Courses set successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error setting courses: " + error.message });
    console.log(error);
  }
};

// Get available courses for a semester

export const getAvailableCourses = async (req, res) => {
  const { session, program, semester, userId } = req.query;

  try {
    // Fetch the student's result card
    const resultCard = await ResultCard.find({ studentId: userId });
    if (!resultCard) {
      return res
        .status(404)
        .json({ message: "Result card not found for the student." });
    }

    // Identify the courses the student has failed (assuming 'F' is the failing grade)
    const failedCourses = resultCard
      .flatMap((res) =>
        res.results
          .filter((result) => result.lg === "F")
          .map((result) => result.courseId._id.toString())
      );


    // Fetch the available courses for the session, program, and semester
    const availableCoursesData = await AvailableCourses.findOne({
      program,
      semester,
    }).populate("courses");


    if (!availableCoursesData) {
      return res.status(200).json([]);
    }

    // Helper function to recursively check for failed prerequisites
    const hasFailedPrerequisite = (course, failedCourses, allCourses) => {
      if (!course.preReq) {
        return false; // No prerequisite, so it's not failed
      }

      const preReqCourseId = course.preReq.toString();

      if (failedCourses.includes(preReqCourseId)) {
        return true;
      }

      const preReqCourse = allCourses.find((c) =>
        c._id.equals(course.preReq)
      );

      if (!preReqCourse) {
        return false; // The prerequisite course is not found, assume it's not failed
      }

      // Recursively check the prerequisite's prerequisites
      return hasFailedPrerequisite(preReqCourse, failedCourses, allCourses);
    };

    const availableCourses = availableCoursesData.courses.filter((course) => {
      return !hasFailedPrerequisite(
        course,
        failedCourses,
        availableCoursesData.courses
      );
    });


    res.status(200).json(availableCourses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching available courses: " + error.message });
  }
};


export const getSemesterAvailableCourses = async (req, res) => {
  const { program, semester } = req.body;
  try {
    const availableCourses = await AvailableCourses.find({
      program,
      semester,
    }).populate("courses");
    res.status(200).json(availableCourses ? availableCourses : {});
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching available courses: " + error.message });
  }
};
