import Marks from "../models/Marks.js";
import Student from "../models/Student.js";
import ResultCard from "../models/ResultCard.js";
import Course from "../models/Course.js";
import Challan from "../models/Challan.js";
import CourseContent from "../models/CourseContent.js";
import Assignment from "../models/Assignment.js";
import CompletedAssignments from "../models/CompletedAssignments.js";
import Timetable from "../models/Timetable.js";
import Attendance from "../models/Attendance.js";
import Semester from "../models/ManageSemester.js";
import Teacher from "../models/Teacher.js";
import sendPushNotification from "../utils/sendPushNotification.js";
const GP_MAP = [
  { min: 90.0, max: 100.0, gp: 4.0, lg: "A+" },
  { min: 89.5, max: 89.9999, gp: 3.975, lg: "A+" },
  { min: 89.0, max: 89.4999, gp: 3.95, lg: "A+" },
  { min: 88.5, max: 88.9999, gp: 3.925, lg: "A+" },
  { min: 88.0, max: 88.4999, gp: 3.9, lg: "A+" },
  { min: 87.5, max: 87.9999, gp: 3.875, lg: "A+" },
  { min: 87.0, max: 87.4999, gp: 3.85, lg: "A+" },
  { min: 86.5, max: 86.9999, gp: 3.825, lg: "A+" },
  { min: 86.0, max: 86.4999, gp: 3.8, lg: "A" },
  { min: 85.5, max: 85.9999, gp: 3.775, lg: "A" },
  { min: 85.0, max: 85.4999, gp: 3.75, lg: "A" },
  { min: 84.5, max: 84.9999, gp: 3.725, lg: "A" },
  { min: 84.0, max: 84.4999, gp: 3.7, lg: "A" },
  { min: 83.5, max: 83.9999, gp: 3.675, lg: "A-" },
  { min: 83.0, max: 83.4999, gp: 3.65, lg: "A-" },
  { min: 82.5, max: 82.9999, gp: 3.625, lg: "A-" },
  { min: 82.0, max: 82.4999, gp: 3.6, lg: "A-" },
  { min: 81.5, max: 81.9999, gp: 3.575, lg: "A-" },
  { min: 81.0, max: 81.4999, gp: 3.55, lg: "A-" },
  { min: 80.5, max: 80.9999, gp: 3.525, lg: "A-" },
  { min: 80.0, max: 80.4999, gp: 3.5, lg: "A-" },
  { min: 79.5, max: 79.9999, gp: 3.475, lg: "B+" },
  { min: 79.0, max: 79.4999, gp: 3.45, lg: "B+" },
  { min: 78.5, max: 78.9999, gp: 3.425, lg: "B+" },
  { min: 78.0, max: 78.4999, gp: 3.4, lg: "B+" },
  { min: 77.5, max: 77.9999, gp: 3.375, lg: "B+" },
  { min: 77.0, max: 77.4999, gp: 3.35, lg: "B+" },
  { min: 76.5, max: 76.9999, gp: 3.325, lg: "B+" },
  { min: 76.0, max: 76.4999, gp: 3.3, lg: "B+" },
  { min: 75.5, max: 75.9999, gp: 3.275, lg: "B" },
  { min: 75.0, max: 75.4999, gp: 3.25, lg: "B" },
  { min: 74.5, max: 74.9999, gp: 3.225, lg: "B" },
  { min: 74.0, max: 74.4999, gp: 3.2, lg: "B" },
  { min: 73.5, max: 73.9999, gp: 3.175, lg: "B" },
  { min: 73.0, max: 73.4999, gp: 3.15, lg: "B" },
  { min: 72.5, max: 72.9999, gp: 3.125, lg: "B" },
  { min: 72.0, max: 72.4999, gp: 3.1, lg: "B" },
  { min: 71.5, max: 71.9999, gp: 3.075, lg: "B" },
  { min: 71.0, max: 71.4999, gp: 3.05, lg: "B" },
  { min: 70.5, max: 70.9999, gp: 3.025, lg: "B" },
  { min: 70.0, max: 70.4999, gp: 3.0, lg: "B" },
  { min: 69.5, max: 69.9999, gp: 2.975, lg: "B-" },
  { min: 69.0, max: 69.4999, gp: 2.95, lg: "B-" },
  { min: 68.5, max: 68.9999, gp: 2.925, lg: "B-" },
  { min: 68.0, max: 68.4999, gp: 2.9, lg: "B-" },
  { min: 67.5, max: 67.9999, gp: 2.875, lg: "B-" },
  { min: 67.0, max: 67.4999, gp: 2.85, lg: "B-" },
  { min: 66.5, max: 66.9999, gp: 2.825, lg: "B-" },
  { min: 66.0, max: 66.4999, gp: 2.8, lg: "B-" },
  { min: 65.5, max: 65.9999, gp: 2.775, lg: "C+" },
  { min: 65.0, max: 65.4999, gp: 2.75, lg: "C+" },
  { min: 64.5, max: 64.9999, gp: 2.725, lg: "C+" },
  { min: 64.0, max: 64.4999, gp: 2.7, lg: "C+" },
  { min: 63.5, max: 63.9999, gp: 2.675, lg: "C+" },
  { min: 63.0, max: 63.4999, gp: 2.65, lg: "C+" },
  { min: 62.5, max: 62.9999, gp: 2.625, lg: "C+" },
  { min: 62.0, max: 62.4999, gp: 2.6, lg: "C+" },
  { min: 61.5, max: 61.9999, gp: 2.575, lg: "C+" },
  { min: 61.0, max: 61.4999, gp: 2.55, lg: "C+" },
  { min: 60.5, max: 60.9999, gp: 2.525, lg: "C+" },
  { min: 60.0, max: 60.4999, gp: 2.5, lg: "C+" },
  { min: 59.5, max: 59.9999, gp: 2.475, lg: "C" },
  { min: 59.0, max: 59.4999, gp: 2.45, lg: "C" },
  { min: 58.5, max: 58.9999, gp: 2.425, lg: "C" },
  { min: 58.0, max: 58.4999, gp: 2.4, lg: "C" },
  { min: 57.5, max: 57.9999, gp: 2.375, lg: "C" },
  { min: 57.0, max: 57.4999, gp: 2.35, lg: "C" },
  { min: 56.5, max: 56.9999, gp: 2.325, lg: "C" },
  { min: 56.0, max: 56.4999, gp: 2.3, lg: "C" },
  { min: 55.5, max: 55.9999, gp: 2.275, lg: "C" },
  { min: 55.0, max: 55.4999, gp: 2.25, lg: "C" },
  { min: 54.5, max: 54.9999, gp: 2.225, lg: "C-" },
  { min: 54.0, max: 54.4999, gp: 2.2, lg: "C-" },
  { min: 53.5, max: 53.9999, gp: 2.175, lg: "C-" },
  { min: 53.0, max: 53.4999, gp: 2.15, lg: "C-" },
  { min: 52.5, max: 52.9999, gp: 2.125, lg: "C-" },
  { min: 52.0, max: 52.4999, gp: 2.1, lg: "C-" },
  { min: 51.5, max: 51.9999, gp: 2.075, lg: "C-" },
  { min: 51.0, max: 51.4999, gp: 2.05, lg: "C-" },
  { min: 50.5, max: 50.9999, gp: 2.025, lg: "C-" },
  { min: 50.0, max: 50.4999, gp: 2.0, lg: "C-" },
  { min: 49.5, max: 49.9999, gp: 1.975, lg: "F" },
  { min: 49.0, max: 49.4999, gp: 1.95, lg: "F" },
  { min: 48.5, max: 48.9999, gp: 1.925, lg: "F" },
  { min: 48.0, max: 48.4999, gp: 1.9, lg: "F" },
  { min: 47.5, max: 47.9999, gp: 1.875, lg: "F" },
  { min: 47.0, max: 47.4999, gp: 1.85, lg: "F" },
  { min: 46.5, max: 46.9999, gp: 1.825, lg: "F" },
  { min: 46.0, max: 46.4999, gp: 1.8, lg: "F" },
  { min: 45.5, max: 45.9999, gp: 1.775, lg: "F" },
  { min: 45.0, max: 45.4999, gp: 1.75, lg: "F" },
  { min: 44.5, max: 44.9999, gp: 1.725, lg: "F" },
  { min: 44.0, max: 44.4999, gp: 1.7, lg: "F" },
  { min: 43.5, max: 43.9999, gp: 1.675, lg: "F" },
  { min: 43.0, max: 43.4999, gp: 1.65, lg: "F" },
  { min: 42.5, max: 42.9999, gp: 1.625, lg: "F" },
  { min: 42.0, max: 42.4999, gp: 1.6, lg: "F" },
  { min: 41.5, max: 41.9999, gp: 1.575, lg: "F" },
  { min: 41.0, max: 41.4999, gp: 1.55, lg: "F" },
  { min: 40.5, max: 40.9999, gp: 1.525, lg: "F" },
  { min: 40.0, max: 40.4999, gp: 1.5, lg: "F" },
  { min: 39.5, max: 39.9999, gp: 1.475, lg: "F" },
  { min: 39.0, max: 39.4999, gp: 1.45, lg: "F" },
  { min: 38.5, max: 38.9999, gp: 1.425, lg: "F" },
  { min: 38.0, max: 38.4999, gp: 1.4, lg: "F" },
  { min: 37.5, max: 37.9999, gp: 1.375, lg: "F" },
  { min: 37.0, max: 37.4999, gp: 1.35, lg: "F" },
  { min: 36.5, max: 36.9999, gp: 1.325, lg: "F" },
  { min: 36.0, max: 36.4999, gp: 1.3, lg: "F" },
  { min: 35.5, max: 35.9999, gp: 1.275, lg: "F" },
  { min: 35.0, max: 35.4999, gp: 1.25, lg: "F" },
  { min: 34.5, max: 34.9999, gp: 1.225, lg: "F" },
  { min: 34.0, max: 34.4999, gp: 1.2, lg: "F" },
  { min: 33.5, max: 33.9999, gp: 1.175, lg: "F" },
  { min: 33.0, max: 33.4999, gp: 1.15, lg: "F" },
  { min: 32.5, max: 32.9999, gp: 1.125, lg: "F" },
  { min: 32.0, max: 32.4999, gp: 1.1, lg: "F" },
  { min: 31.5, max: 31.9999, gp: 1.075, lg: "F" },
  { min: 31.0, max: 31.4999, gp: 1.05, lg: "F" },
  { min: 30.5, max: 30.9999, gp: 1.025, lg: "F" },
  { min: 30.0, max: 30.4999, gp: 1.0, lg: "F" },
  { min: 29.5, max: 29.9999, gp: 0.975, lg: "F" },
  { min: 29.0, max: 29.4999, gp: 0.95, lg: "F" },
  { min: 28.5, max: 28.9999, gp: 0.925, lg: "F" },
  { min: 28.0, max: 28.4999, gp: 0.9, lg: "F" },
  { min: 27.5, max: 27.9999, gp: 0.875, lg: "F" },
  { min: 27.0, max: 27.4999, gp: 0.85, lg: "F" },
  { min: 26.5, max: 26.9999, gp: 0.825, lg: "F" },
  { min: 26.0, max: 26.4999, gp: 0.8, lg: "F" },
  { min: 25.5, max: 25.9999, gp: 0.775, lg: "F" },
  { min: 25.0, max: 25.4999, gp: 0.75, lg: "F" },
  { min: 24.5, max: 24.9999, gp: 0.725, lg: "F" },
  { min: 24.0, max: 24.4999, gp: 0.7, lg: "F" },
  { min: 23.5, max: 23.9999, gp: 0.675, lg: "F" },
  { min: 23.0, max: 23.4999, gp: 0.65, lg: "F" },
  { min: 22.5, max: 22.9999, gp: 0.625, lg: "F" },
  { min: 22.0, max: 22.4999, gp: 0.6, lg: "F" },
  { min: 21.5, max: 21.9999, gp: 0.575, lg: "F" },
  { min: 21.0, max: 21.4999, gp: 0.55, lg: "F" },
  { min: 20.5, max: 20.9999, gp: 0.525, lg: "F" },
  { min: 20.0, max: 20.4999, gp: 0.5, lg: "F" },
  { min: 19.5, max: 19.9999, gp: 0.475, lg: "F" },
  { min: 19.0, max: 19.4999, gp: 0.45, lg: "F" },
  { min: 18.5, max: 18.9999, gp: 0.425, lg: "F" },
  { min: 18.0, max: 18.4999, gp: 0.4, lg: "F" },
  { min: 17.5, max: 17.9999, gp: 0.375, lg: "F" },
  { min: 17.0, max: 17.4999, gp: 0.35, lg: "F" },
  { min: 16.5, max: 16.9999, gp: 0.325, lg: "F" },
  { min: 16.0, max: 16.4999, gp: 0.3, lg: "F" },
  { min: 15.5, max: 15.9999, gp: 0.275, lg: "F" },
  { min: 15.0, max: 15.4999, gp: 0.25, lg: "F" },
  { min: 14.5, max: 14.9999, gp: 0.225, lg: "F" },
  { min: 14.0, max: 14.4999, gp: 0.2, lg: "F" },
  { min: 13.5, max: 13.9999, gp: 0.175, lg: "F" },
  { min: 13.0, max: 13.4999, gp: 0.15, lg: "F" },
  { min: 12.5, max: 12.9999, gp: 0.125, lg: "F" },
  { min: 12.0, max: 12.4999, gp: 0.1, lg: "F" },
  { min: 11.5, max: 11.9999, gp: 0.075, lg: "F" },
  { min: 11.0, max: 11.4999, gp: 0.05, lg: "F" },
  { min: 10.5, max: 10.9999, gp: 0.025, lg: "F" },
  { min: 10.0, max: 10.4999, gp: 0.0, lg: "F" },
  { min: 0, max: 9.9999, gp: 0.0, lg: "F" },
];

const calculateGP = (marks) => {
  for (const range of GP_MAP) {
    if (marks >= range.min && marks <= range.max) {
      return { gp: range.gp, lg: range.lg };
    }
  }
  return { gp: 0.0, lg: "F" };
};

// Function to rearrange maxCourseMarks in the specific "abaaa" order and then reverse the list
const rearrangeMaxCourseMarks = (maxCourseMarks) => {
  const maxValue = Math.max(...maxCourseMarks);
  const index = maxCourseMarks.indexOf(maxValue);

  if (index > -1) {
    maxCourseMarks.splice(index, 1);
    maxCourseMarks.splice(1, 0, maxValue);
  }

  return maxCourseMarks.reverse();
};

// Helper function to calculate average marks for specific types
const calculateAverageMarks = (marksDocuments, typePrefix) => {
  const filteredMarks = marksDocuments.filter((doc) =>
    doc.marksType.startsWith(typePrefix)
  );
  if (filteredMarks.length === 0) return 0;
  const totalMarks = filteredMarks.reduce((sum, doc) => sum + doc.Marks, 0);
  return totalMarks / filteredMarks.length;
};
// Helper function to round to the nearest multiple of 0.05
const roundToNearest = (value, multiple) => {
  return Math.round(value / multiple) * multiple;
};

// Function to clear all documents in the specified collections
const clearCollections = async () => {
  await Challan.deleteMany({});
  await CourseContent.deleteMany({});
  await Assignment.deleteMany({});
  await CompletedAssignments.deleteMany({});
  await Timetable.deleteMany({});
};

const calculateResult = async (semesterId) => {
  try {
    // Clear specified collections before calculation
    await clearCollections();

    const students = await Student.find();

    for (const student of students) {
      // Skip the student if they have completed their program
      if (student.semester >= student.programSemesters) {
        console.log(
          `Skipping result calculation for studentId: ${student._id} as they have completed their program.`
        );
        continue;
      }

      let totalCreditHours = 0;
      let weightedMarksSum = 0; // Variable to sum weighted marks
      let totalGP = 0;

      const resultEntries = [];

      let assignedCourses = await Course.find({
        _id: { $in: student.Assignedcourses.map((ac) => ac.courseId) },
      });

      let marksDocuments = await Marks.find({
        studentId: student._id,
        courseId: { $in: student.Assignedcourses.map((ac) => ac.courseId) },
      });

      // Identify re-enrolled courses
      const previousResultCards = await ResultCard.find({
        studentId: student._id,
      });
      const reEnrolledCourseIds = new Set();

      for (const previousResult of previousResultCards) {
        for (const result of previousResult.results) {
          reEnrolledCourseIds.add(result.courseId.toString());
        }
      }

      // Calculate maxCourseMarks for all non-re-enrolled courses first
      const rearrangedMaxCourseMarks = assignedCourses
        .filter((course) => !reEnrolledCourseIds.has(course._id.toString()))
        .map((course) => course.creditHours * 50);

      let index = 0;

      for (const assignedCourse of student.Assignedcourses) {
        const courseDetails = assignedCourses.find((course) =>
          course._id.equals(assignedCourse.courseId)
        );

        if (!courseDetails) {
          console.warn(
            `Course not found for courseId: ${assignedCourse.courseId}`
          );
          continue;
        }

        const courseMarksDocuments = marksDocuments.filter((markDoc) =>
          markDoc.courseId.equals(assignedCourse.courseId)
        );

        if (courseMarksDocuments.length > 0) {
          // Calculate average marks for quizzes and assignments
          const averageQuizMarks = calculateAverageMarks(
            courseMarksDocuments,
            "Quiz"
          );
          const averageAssignmentMarks = calculateAverageMarks(
            courseMarksDocuments,
            "Assignment"
          );
          const averageLabAssignmentMarks = calculateAverageMarks(
            courseMarksDocuments,
            "Lab Assignment"
          );

          // Sum other marks types if necessary
          const otherMarks = courseMarksDocuments
            .filter(
              (doc) =>
                !doc.marksType.startsWith("Quiz") &&
                !doc.marksType.startsWith("Assignment") &&
                !doc.marksType.startsWith("Lab Assignment")
            )
            .reduce((sum, doc) => sum + doc.Marks, 0);

          const courseTotalMarks =
            averageQuizMarks +
            averageAssignmentMarks +
            averageLabAssignmentMarks +
            otherMarks;

          // Validate courseTotalMarks
          if (isNaN(courseTotalMarks)) {
            console.warn(
              `Invalid total marks for courseId: ${assignedCourse.courseId}`
            );
            continue;
          }

          const courseCreditHours = courseDetails.creditHours;

          // Get the next rearranged maxCourseMarks value for non-re-enrolled courses
          const maxCourseMarks = reEnrolledCourseIds.has(
            assignedCourse.courseId.toString()
          )
            ? courseCreditHours * 50
            : rearrangedMaxCourseMarks[index++];

          // Check if maxCourseMarks is zero to prevent division by zero
          if (maxCourseMarks === 0) {
            console.warn(
              `Max course marks is zero for courseId: ${assignedCourse.courseId}`
            );
            continue;
          }

          // Calculate the gained marks as a percentage out of 100
          const scaledMarks = (courseTotalMarks * 100) / maxCourseMarks;
          const roundedScaledMarks = Math.round(scaledMarks);

          // Validate scaledMarks
          if (isNaN(roundedScaledMarks)) {
            console.warn(
              `Invalid scaled marks for courseId: ${assignedCourse.courseId}`
            );
            continue;
          }

          const courseGPData = calculateGP(roundedScaledMarks);

          // Calculate the weighted marks for semester GPA calculation
          weightedMarksSum += roundedScaledMarks * courseCreditHours;

          totalCreditHours += courseCreditHours;
          totalGP += courseGPData.gp * courseCreditHours;

          // Check if the course was already enrolled in a previous semester
          let courseAlreadyEnrolled = false;

          for (const previousResult of previousResultCards) {
            for (const result of previousResult.results) {
              if (result.courseId.equals(assignedCourse.courseId)) {
                // Update the previous result with new marks
                result.gainedMarks = roundedScaledMarks;
                result.gp = courseGPData.gp;
                result.lg = courseGPData.lg;
                result.cp = courseGPData.gp * courseCreditHours;

                await previousResult.save();
                courseAlreadyEnrolled = true;
                break;
              }
            }
            if (courseAlreadyEnrolled) break;
          }

          // If the course was not already enrolled, add to current result entries
          if (!courseAlreadyEnrolled) {
            resultEntries.push({
              courseId: assignedCourse.courseId,
              courseName: courseDetails.courseName,
              creditHours: courseCreditHours,
              totalMarks: 100, // Total marks set to 100
              gainedMarks: roundedScaledMarks, // Gained marks out of 100, rounded to nearest whole number
              gp: courseGPData.gp,
              lg: courseGPData.lg,
              cp: courseGPData.gp * courseCreditHours,
            });
          }
        } else {
          console.warn(
            `Marks not found for studentId: ${student._id}, courseId: ${assignedCourse.courseId}`
          );
        }
      }

      // Identify courses that the student did not enroll in due to failed prerequisites
      const allCourses = await Course.find({ program: student.program });

      const failedCourses = new Set(
        previousResultCards
          .flatMap((card) => card.results)
          .filter((result) => result.lg === "F")
          .map((result) => result.courseId.toString())
      );

      const unenrolledFailedCourses = allCourses.filter((course) => {
        return (
          course.preReq &&
          failedCourses.has(course.preReq.toString()) &&
          !student.Assignedcourses.some((ac) => ac.courseId.equals(course._id))
        );
      });

      // Add unenrolledFailedCourses to assignedCourses and update marksDocuments
      assignedCourses = [...assignedCourses, ...unenrolledFailedCourses];

      const newMarksDocuments = unenrolledFailedCourses.map((course) => ({
        studentId: student._id,
        courseId: course._id,
        marksType: "None", // Assuming no marks available for unenrolled courses
        Marks: 0,
      }));
      marksDocuments = [...marksDocuments, ...newMarksDocuments];

      for (const course of unenrolledFailedCourses) {
        resultEntries.push({
          courseId: course._id,
          courseName: course.courseName,
          creditHours: course.creditHours,
          totalMarks: 100,
          gainedMarks: 0,
          gp: 0.0,
          lg: "F",
          cp: 0.0,
        });
      }

      if (totalCreditHours > 0) {
        // Calculate Semester Weighted Average Percentage
        const semesterWeightedAveragePercentage = (
          weightedMarksSum / totalCreditHours
        ).toFixed(3);

        // Calculate semester GPA based on the weighted average percentage
        const semesterGPAData = calculateGP(semesterWeightedAveragePercentage);
        const semesterGPA = semesterGPAData.gp;

        // Round semesterGPA to the nearest 0.05
        const roundedSemesterGPA = roundToNearest(semesterGPA, 0.05);

        let totalPreviousCreditHours = 0;
        let totalPreviousQualityPoints = 0;

        for (const previousResult of previousResultCards) {
          for (const result of previousResult.results) {
            totalPreviousCreditHours += result.creditHours;
            totalPreviousQualityPoints += result.gp * result.creditHours;
          }
        }

        totalPreviousCreditHours += totalCreditHours;
        totalPreviousQualityPoints += totalGP;

        const cumulativeGPA =
          totalPreviousQualityPoints / totalPreviousCreditHours;

        // Round cumulativeGPA to the nearest 0.05
        const roundedCumulativeGPA = roundToNearest(cumulativeGPA, 0.05);

        // Update existing ResultCard if it exists for this semester, else create a new one
        let resultCard = await ResultCard.findOne({
          studentId: student._id,
          semesterId: semesterId,
        });
        if (!resultCard) {
          resultCard = new ResultCard({
            studentId: student._id,
            semesterId: semesterId,
            results: resultEntries,
          });
        } else {
          resultCard.results = resultEntries;
        }
        resultCard.cumulativeGPA = roundedCumulativeGPA.toFixed(2);
        resultCard.semesterGPA = roundedSemesterGPA.toFixed(2);

        await resultCard.save();

        // Recalculate CGPA and GPA for previous result cards
        for (const previousResult of previousResultCards) {
          let prevTotalCreditHours = 0;
          let prevTotalQualityPoints = 0;
          for (const result of previousResult.results) {
            prevTotalCreditHours += result.creditHours;
            prevTotalQualityPoints += result.gp * result.creditHours;
          }
          const prevCumulativeGPA =
            prevTotalQualityPoints / prevTotalCreditHours;
          previousResult.cumulativeGPA = roundToNearest(
            prevCumulativeGPA,
            0.05
          ).toFixed(2);

          let prevWeightedMarksSum = 0;
          for (const result of previousResult.results) {
            prevWeightedMarksSum += result.gainedMarks * result.creditHours;
          }
          const prevSemesterWeightedAveragePercentage = (
            prevWeightedMarksSum / prevTotalCreditHours
          ).toFixed(3);
          const prevSemesterGPAData = calculateGP(
            prevSemesterWeightedAveragePercentage
          );
          const prevSemesterGPA = prevSemesterGPAData.gp;
          previousResult.semesterGPA = roundToNearest(
            prevSemesterGPA,
            0.05
          ).toFixed(2);

          await previousResult.save();
        }

        // Update the student's semester
        if (student.semester < student.programSemesters) {
          student.semester += 1;
          student.Assignedcourses = [];
          await student.save();
        }
      } else {
        console.warn(`No valid courses found for studentId: ${student._id}`);
      }
    }

    const notificationPromises = students.map((student) => {
      return sendPushNotification(
        student.expoPushToken,
        "Semester Result",
        "New Result is Available."
      );
    });

    await Promise.all(notificationPromises);

  } catch (error) {
    console.error("Error calculating results:", error);
  }
};













const getAllResultCardsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Fetch the result cards with the populated student, semester, and course information
    const resultCards = await ResultCard.find({ studentId })
      .populate("studentId", "name")
      .populate("semesterId", "name")
      .populate("results.courseId", "courseName");

    if (!resultCards || resultCards.length === 0) {
      return res.status(404).json({ message: "ResultCards not found" });
    }

    // Fetch all course IDs and semester IDs from the result cards
    const courseIds = [];
    const semesterIds = new Set();
    resultCards.forEach((resultCard) => {
      semesterIds.add(resultCard.semesterId._id.toString());
      resultCard.results.forEach((result) => {
        courseIds.push(result.courseId._id.toString());
      });
    });

    // Fetch course codes
    const courses = await Course.find({ _id: { $in: courseIds } }).select(
      "courseName courseCode"
    );

    // Fetch semester names
    const semesters = await Semester.find({
      _id: { $in: Array.from(semesterIds) },
    }).select("semesterName");

    // Create a map for course codes and semester names
    const courseMap = new Map();
    courses.forEach((course) => {
      courseMap.set(course._id.toString(), course.courseCode);
    });

    const semesterMap = new Map();
    semesters.forEach((semester) => {
      semesterMap.set(semester._id.toString(), semester.semesterName);
    });
    // Add course codes and semester names to the result cards
    const updatedResultCards = resultCards.map((resultCard) => {
      const updatedResults = resultCard.results.map((result) => ({
        ...result._doc,
        courseId: {
          ...result.courseId._doc,
          courseCode: courseMap.get(result.courseId._id.toString()),
        },
      }));

      return {
        ...resultCard._doc,
        results: updatedResults,
        semesterName: semesterMap.get(resultCard.semesterId._id.toString()),
      };
    });
    res.status(200).json(updatedResultCards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getCGPAByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    // Fetch the result cards with the populated student, semester, and course information
    const resultCards = await ResultCard.find({ studentId })
      .populate("semesterId", "semesterName")
      .sort({ semesterId: 1 }); // Assuming you want to sort by semesterId ascending

    if (!resultCards || resultCards.length === 0) {
      return res.status(404).json({ message: "ResultCards not found" });
    }

    // Extract CGPA and semesterName from result cards
    const cgpaData = resultCards.map((resultCard) => ({
      value: resultCard.cumulativeGPA,
      label: getFormattedSemesterName(resultCard.semesterId.semesterName)
    }));

    // Function to format semesterName as desired (e.g., "fall 2020" to "FA20")
    function getFormattedSemesterName(semesterName) {
      // Example formatting logic, adjust as needed
      const parts = semesterName.split(' '); // Split by space to separate "fall" or "spring" and year
      const season = parts[0].charAt(0).toUpperCase() + parts[0].charAt(1).toUpperCase(); // First two letters capitalized
      const year = parts[1].slice(2); // Last two digits of the year
      return `${season}${year}`;
    }
console.log(cgpaData);
    res.status(200).json(cgpaData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export { calculateResult, getAllResultCardsByStudent,getCGPAByStudent };







