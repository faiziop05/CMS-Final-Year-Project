import mongoose from 'mongoose';

const AssignedCourseSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  courseCode: {
    type: String,
    required: true
  },
  creditHours: {
    type: Number,
    required: true
  },
  session: {
    type: String,
    required: true
  },
  program: {
    type: String,
    required: true
  },
  semesterName: {
    type: String,
    required: true
  },
});

const TeacherSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  Phoneno: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true,
    unique: true
  },
  HomeAddress: {
    type: String,
    required: true
  },
  post: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  program: {
    type: String,
    required: true
  },

  Assignedcourses: [AssignedCourseSchema]
});

const Teacher = mongoose.model('Teacher', TeacherSchema);

export default Teacher;
