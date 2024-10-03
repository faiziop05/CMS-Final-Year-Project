// controllers/courseController.js
import Course from '../models/Course.js';

export const getCourses = async (req, res) => {
  const { program } = req.body;
  try {
    const courses = await Course.find({program});
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const addCourse = async (req, res) => {
  const { courseName, courseCode, creditHours,program ,preReq} = req.body;
  
  try {
    const newCourse = new Course({
      courseName,
      courseCode,
      creditHours,
      program,
      preReq

    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { courseName, courseCode, creditHours,program ,preReq} = req.body;

  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { courseName, courseCode, creditHours,program ,preReq},
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course deleted' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
