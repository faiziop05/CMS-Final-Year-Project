import mongoose from 'mongoose';

const AvailableCoursesSchema = new mongoose.Schema({

  program: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  }]
});

// Create a compound index for session, program, and semester
AvailableCoursesSchema.index({ program: 1, semester: 1 }, { unique: true });

const AvailableCourses = mongoose.model('AvailableCourses', AvailableCoursesSchema);
export default AvailableCourses;
