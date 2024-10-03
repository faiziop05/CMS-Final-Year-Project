// controllers/teacherController.js
import Teacher from '../models/Teacher.js';
import mongoose from 'mongoose'; // Import mongoose module
import Course from '../models/Course.js';
export const getTeachers = async (req, res) => {
  const { program } = req.body;
  try {
    const teachers = await Teacher.find({program});
    res.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const addTeacher = async (req, res) => {
  const { fullName, Phoneno, Email, HomeAddress, post,program, username, password } = req.body;

  try {
    const newTeacher = new Teacher({
      fullName,
      Phoneno,
      Email,
      HomeAddress,
      post,
      username,
      program,
      password,
    });

    const teacher = await newTeacher.save();
    res.status(201).json(teacher);
  } catch (error) {
    console.error('Error adding teacher:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateTeacher = async (req, res) => {
  const { id } = req.params; // Change to phone number parameter
  const { fullName, Phoneno, Email, HomeAddress,program, post, username, password } = req.body;
  try {
    let teacher = await Teacher.findByIdAndUpdate(id,
      { fullName, Phoneno, Email, HomeAddress, post,program, username, password },
      { new: true }
    );

    res.json(teacher);
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteTeacher = async (req, res) => {
  const { id } = req.params; 
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const teacher = await Teacher.findById(id); // Find teacher by ID

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    await Teacher.deleteOne({ _id: id }); // Use teacher ID for deletion

    res.json({ message: 'Teacher deleted' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


export const assignCourse = async (req, res) => {
  const { teacherId, courseIds, session, program,semesterName } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ message: 'Invalid teacher ID format' });
    }

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    for (const courseId of courseIds) {
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ message: `Invalid course ID format: ${courseId}` });
      }
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: `Course not found: ${courseId}` });
      }

      // Check if the exact combination of courseId, session, and program already exists
      const existingAssignment = teacher.Assignedcourses.some(
        (c) => c.courseId.toString() === courseId &&
               c.session === session &&
               c.program === program
      );

      if (!existingAssignment) {
        teacher.Assignedcourses.push({
          courseId: course._id,
          courseName: course.courseName,
          courseCode: course.courseCode,
          creditHours: course.creditHours,
          session: session,
          program: program,
          semesterName: semesterName
        });
      }
    }

    await teacher.save();
    res.status(201).json({ message: 'Courses assigned successfully' });
  } catch (error) {
    console.error('Error assigning courses:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


export const unassignCourse = async (req, res) => {
  const { teacherId, courseId, session, program } = req.body;
console.log(session);
  try {
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ message: 'Invalid teacher ID format' });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    teacher.Assignedcourses = teacher.Assignedcourses.filter(
      (course) => !(course.courseId.toString() === courseId && course.session === session && course.program === program)
    );

    await teacher.save();
    res.status(200).json({ message: 'Course unassigned successfully' });
  } catch (error) {
    console.error('Error unassigning course:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};




export const getTeacherById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const teacher = await Teacher.findById(id).populate('Assignedcourses.courseId');

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
export const getTeacherById1 = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};






export const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { password, oldPassword, ...updates } = req.body; // Separate oldPassword and password from the rest of the fields
  try {
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).send("Admin not found");
    }

    // Validate old password if updating password
    if (password && oldPassword) {
      if (teacher.password !== oldPassword) {
        return res.status(400).send("Old password does not match");
      }
      updates.password = password;
    }

    // Use $set to add or update fields
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true } // Return the updated document, run validators
    );

    res.status(200).json(updatedTeacher);
  } catch (error) {
    res.status(500).send("Error updating admin: " + error.message);
  }
};

