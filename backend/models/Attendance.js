// models/Attendance.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const attendanceSchema = new Schema({

  class: String,
  classType: String,
  date: String,
  startTime: String,
  endTime: String,
  title: String,
  courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
  studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
  teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher' },
  RegNum: String,
  StudentName: String,
  isChecked: Boolean,
  session:String,
  program:String,

});

const Attendance = mongoose.model('Attendances', attendanceSchema);

export default Attendance;
