import mongoose from 'mongoose';

const CompletedAssignmentSchema = new mongoose.Schema({
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
  program: {
    type: String,
    required: true
  },
  courseId: {
    type: String,
    required: true
  },
  rollNo: {
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

});

const CompletedAssignment = mongoose.model('CompletedAssignment', CompletedAssignmentSchema);
export default CompletedAssignment;
