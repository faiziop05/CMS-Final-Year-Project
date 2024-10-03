// src/models/User.js
import mongoose from "mongoose";

const MainAdminSchema = new mongoose.Schema({
  fullName: {
    type: String,
  },
  username: { type: String, required: true },
  password: { type: String, required: true },
  phoneNo: { type: String },
  email: { type: String },
});

const MainAdmin = mongoose.model("MainAdmin", MainAdminSchema);

export default MainAdmin;
