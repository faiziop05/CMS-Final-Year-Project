import mongoose from 'mongoose';

const ChallanSchema = new mongoose.Schema({
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
  session: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

const Challan = mongoose.model('Challan', ChallanSchema);
export default Challan;
