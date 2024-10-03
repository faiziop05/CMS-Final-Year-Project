import mongoose from "mongoose";

const MarksSchema = new mongoose.Schema({
  RegNum: {
    type: String,
    required: true,
  },
  StudentName: {
    type: String,
    required: true,
  },
  marksType: {
    type: String,
    required: true,
  },
  Marks: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d+(\.\d{1,2})?$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid mark! Marks should be a number with up to two decimal places.`,
    },
  },
  TotalMarks: {
    type: Number,
    required: true,
  },
  session: {
    type: String,
    required: true,
  },
  program: {
    type: String,
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  Date:{
    type:String,
    required:true
  }
});

const Marks = mongoose.model("Marks", MarksSchema);

export default Marks;
