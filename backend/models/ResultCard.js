// models/ResultCard.js
import mongoose from 'mongoose';

const ResultCardSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  semesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Semester',
    required: true,
  },
  results: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
      },
      totalMarks: {
        type: Number,
        required: true,
      },
      gainedMarks: {
        type: Number,
        required: true,
      },
      lg: {
        type: String,
        required: true,
      },
      gp: {
        type: Number,
        required: true,
      },
      cp: {
        type: Number,
        required: true,
      },
      creditHours: {
        type: Number,
        required: true,
      },
    },
  ],
  semesterGPA: {
    type: Number,
    required: true,
  },
  cumulativeGPA: {
    type: Number,
    required: true,
  },
});

const ResultCard = mongoose.model('ResultCard', ResultCardSchema);

export default ResultCard;
