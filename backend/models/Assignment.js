import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema({
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
  title: {
    type: String,
    required: true
  },
  
  description: {
    type: String,
    required: true
  },
  program: {
    type: String,
    required: true
  },
  courseId: {
    type: String,
    required: true
  },
  
  session: {
    type: String,
    required: true
  },
  courseTitle: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  deadline: {
    type: Date,
    required: true
  }
});

const Assignment = mongoose.model('Assignment', AssignmentSchema);
export default Assignment;
