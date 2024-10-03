import mongoose from 'mongoose';

const AvailableReEnrollCoursesSchema = new mongoose.Schema({

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
AvailableReEnrollCoursesSchema.index({  program: 1, semester: 1 }, { unique: true });

const AvailableReEnrollCourses = mongoose.model('AvailableReEnrollCourses', AvailableReEnrollCoursesSchema);
export default AvailableReEnrollCourses;
