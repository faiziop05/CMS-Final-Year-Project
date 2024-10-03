// controllers/availableCoursesController.js
import AvailableReEnrollCourses from "../models/AvailableReEnrollCourses.js";
import ResultCard from "../models/ResultCard.js";
// Set available courses for a semester
export const setAvailableCourses = async (req, res) => {
  const { session, program, semester, courseIds } = req.body;


  if ( !semester || !program || !courseIds || !Array.isArray(courseIds)) {
    return res.status(400).json({ message: "Invalid data format" });
  }

  try {
    // Check if a document with the same session, program, and semester already exists
    const existingCourses = await AvailableReEnrollCourses.findOne({  program, semester });

    if (existingCourses) {
      // If the document exists, update the list of courses
      existingCourses.courses = courseIds;
      await existingCourses.save();
    } else {

      // If the document does not exist, create a new one
      await AvailableReEnrollCourses.create({
        program,
        semester,
        courses: courseIds
      });
    }

    res.status(200).json({ message: "Courses set successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error setting courses: " + error.message });
    console.log(error);
  }
};




// Get available courses for a semester
export const getAvailableCourses = async (req, res) => {
  const {  program, semester, userId } = req.query;

  try {
    // Fetch the available re-enroll courses
    const availableCoursesData = await AvailableReEnrollCourses.findOne({
      program,
      semester,
    }).populate("courses");

    if (!availableCoursesData) {
      return res.status(404).json({ message: "No available re-enroll courses found." });
    }

    const availableCourses = availableCoursesData.courses.map(course => course._id.toString());

    // Fetch the student's result cards to determine failed courses
    const resultCards = await ResultCard.find({ studentId: userId }).populate('results.courseId', 'courseName');

    const failedCourses = resultCards.reduce((acc, resultCard) => {
      resultCard.results.forEach(result => {
        if (result.lg === 'F') { // Check if the student failed the course
          acc.add(result.courseId._id.toString());
        }
      });
      return acc;
    }, new Set());

    // Filter the available courses to only include those the student has failed
    const reEnrollCourses = availableCoursesData.courses.filter(course => failedCourses.has(course._id.toString()));

    res.status(200).json(reEnrollCourses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching available courses: " + error.message });
  }
};


export const getSemesterAvailableCourses = async (req, res) => {
  const {  program, semester } = req.body;
  try {
    const availableCourses = await AvailableReEnrollCourses.find({
      program,
      semester,
    }).populate("courses")
    console.log(availableCourses);
    res.status(200).json(availableCourses ? availableCourses : {});
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching available courses: " + error.message });
  }
};
