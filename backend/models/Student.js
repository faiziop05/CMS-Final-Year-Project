import mongoose from 'mongoose';

const AssignedCourseSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  courseCode: {
    type: String,
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  teacherName: {
    type: String,
    required: true
  }
});
const StudentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  phoneNo: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  homeAddress: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
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
  programSemesters:{
    type: Number,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  profilePicture: {
    data: Buffer,
    contentType: String,
  },
  expoPushToken: { // New field for storing the expo push token
    type: String,
    required: false
  },
  Assignedcourses: [AssignedCourseSchema]
});

const Student = mongoose.model('Student', StudentSchema);

export default Student;
