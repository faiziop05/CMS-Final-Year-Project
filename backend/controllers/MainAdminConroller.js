import MainAdmin from "../models/MainAdmin.js";
import mongoose from "mongoose";
export const getAdminById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const admin = await MainAdmin.findById(id);

    if (!admin) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(admin);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


export const updateAdminProfile = async (req, res) => {
    const { id } = req.params;
    const { password, oldPassword, ...updates } = req.body; // Separate oldPassword and password from the rest of the fields
  console.log(password,oldPassword);
    try {
      const admin = await MainAdmin.findById(id);
      if (!admin) {
        return res.status(404).send("Admin not found");
      }
  
      // Validate old password if updating password
      if (password && oldPassword) {
        if (admin.password !== oldPassword) {
          return res.status(400).send("Old password does not match");
        }
        updates.password = password;
      }
  
      // Use $set to add or update fields
      const updatedAdmin = await MainAdmin.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true } // Return the updated document, run validators
      );
  
      res.status(200).json(updatedAdmin);
    } catch (error) {
      res.status(500).send("Error updating admin: " + error.message);
    }
  };





