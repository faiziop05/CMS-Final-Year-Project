// models/Attendance.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const SemesterSchema = new Schema({
    semesterName: String,
  deadline: Date,
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

const Semester = mongoose.model('Semester', SemesterSchema);

export default Semester;
