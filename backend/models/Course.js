// models/Course.js
import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  courseCode: {
    type: String,
    required: true,
    unique: true,
  },
  creditHours: {
    type: Number,
    required: true,
  },

  program: {
    type: String,
    required: true,
  },
  preReq: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },

});

const Course = mongoose.model('Course', CourseSchema);

export default Course;
