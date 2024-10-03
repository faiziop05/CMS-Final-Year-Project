// controllers/teacherController.js
import Coordinator from '../models/ManageCoordinator.js';
import mongoose from 'mongoose'; // Import mongoose module
export const getCoordinator = async (req, res) => {
  try {
    const teachers = await Coordinator.find();
    res.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const addCoordinator = async (req, res) => {
  const { fullName, Phoneno, Email,assignedDepartments, HomeAddress, username, password } = req.body;

  try {
    const newCoordinator = new Coordinator({
      fullName,
      Phoneno,
      Email,
      assignedDepartments,
      HomeAddress,
      username,
      password,
    });

    const coordinator = await newCoordinator.save();
    res.status(201).json(coordinator);
  } catch (error) {
    console.error('Error adding teacher:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateCoordinator = async (req, res) => {
  const {id}=req.params;
  console.log(id);
  const { fullName, Phoneno, Email, HomeAddress, assignedDepartments, username, password } = req.body;
  try {

   let coordinator = await Coordinator.findByIdAndUpdate(
      id,
      { fullName, Phoneno, Email, HomeAddress, assignedDepartments, username, password },
      { new: true }
    );

    res.json(coordinator);
  } catch (error) {
    console.error('Error updating coordinator:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteCoordinator = async (req, res) => {
  const { id } = req.params; // Extract the ID from the request parameters
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      // Check if the ID is a valid MongoDB ObjectId
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const coordinator = await Coordinator.findById(id); // Find teacher by ID

    if (!coordinator) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    await Coordinator.deleteOne({ _id: id }); // Use teacher ID for deletion

    res.json({ message: 'Teacher deleted' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};



export const getCoordinatorById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const coordinator = await Coordinator.findById(id).populate('assignedDepartments');

    if (!coordinator) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(coordinator);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
export const getCoordinatorById1 = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const coordinator = await Coordinator.findById(id);
    if (!coordinator) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(coordinator);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};




export const updateProfile = async (req, res) => {
    const { id } = req.params;
    const { password, oldPassword, ...updates } = req.body; // Separate oldPassword and password from the rest of the fields
    console.log(password,oldPassword);
    try {
      const coordinator = await Coordinator.findById(id);
      if (!coordinator) {
        return res.status(404).send("Admin not found");
      }
  
      // Validate old password if updating password
      if (password && oldPassword) {
        if (coordinator.password !== oldPassword) {
          return res.status(400).send("Old password does not match");
        }
        updates.password = password;
      }
  
      // Use $set to add or update fields
      const updatedCoordinator = await Coordinator.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true } // Return the updated document, run validators
      );
  
      res.status(200).json(updatedCoordinator);
    } catch (error) {
      res.status(500).send("Error updating admin: " + error.message);
    }
  };