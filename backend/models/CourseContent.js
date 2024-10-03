import mongoose from 'mongoose';

const CourseContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  fileData: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  courseId: {
    type: String,
    ref: 'Course',
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
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('CourseContent', CourseContentSchema);
