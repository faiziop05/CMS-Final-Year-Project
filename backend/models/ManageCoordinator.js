import mongoose from 'mongoose';

const CoordinatorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  Phoneno: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true,
    unique: true
  },
  HomeAddress: {
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
  assignedDepartments: []
});

const Coordinator = mongoose.model('Coordinator', CoordinatorSchema);

export default Coordinator;
