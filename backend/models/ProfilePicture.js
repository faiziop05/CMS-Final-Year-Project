import mongoose from "mongoose";

const profilePictureSchema = new mongoose.Schema({
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    profilePicture: {
      data: Buffer,
      contentType: String,
    },
  });

const ProfilePicture = mongoose.model("ProfilePicture", profilePictureSchema);

export default ProfilePicture;
