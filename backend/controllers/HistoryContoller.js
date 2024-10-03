import Marks from "../models/Marks.js";
import Course from "../models/Course.js";

export const GetHistoryCourses = async (req, res) => {
    const { teacherId } = req.body;

    if (!teacherId) {
      return res.status(400).json({ error: 'Teacher Id is required' });
    }

    try {
        // Find all marks data for the specific teacher
        const marksList = await Marks.find({ teacherId: teacherId }).populate('courseId');
        
        // Create a set to store unique course combinations
        const uniqueCourses = new Set();

        const courseData = marksList.map(mark => {
            const course = mark.courseId;
            const courseDetails = {
                courseId:mark.courseId._id,
                courseName: course.courseName,
                courseCode: course.courseCode,
                session: mark.session,
                program: mark.program
            };
            // Create a unique identifier string
            const uniqueIdentifier = `${course.courseName}_${course.courseCode}_${mark.session}_${mark.program}`;

            // Add to set if not already present
            if (!uniqueCourses.has(uniqueIdentifier)) {
                uniqueCourses.add(uniqueIdentifier);
                return courseDetails;
            }
        }).filter(Boolean);  // Filter out undefined entries

        res.status(200).json(courseData);
    } catch (error) {
        console.error('Error fetching course data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
