// src/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const StudentLogin = mongoose.model('students', userSchema);

export default StudentLogin;