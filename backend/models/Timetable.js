import mongoose from 'mongoose';

const TimetableSchema = new mongoose.Schema({
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
  title: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
});

const Timetable = mongoose.model('Timetable', TimetableSchema);
export default Timetable;
