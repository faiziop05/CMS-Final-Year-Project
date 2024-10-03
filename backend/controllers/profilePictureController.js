import ProfilePicture from '../models/ProfilePicture.js';

export const uploadProfilePicture = async (req, res) => {
    try {
      const { userId } = req.body; // Assuming you send the userId in the request body
  console.log(userId);
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      // Check if a profile picture already exists for the user
      let profilePicture = await ProfilePicture.findOne({ studentId: userId });
  
      if (profilePicture) {
        // Update the existing profile picture
        profilePicture.profilePicture = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
        await profilePicture.save();
        res.status(200).json({
          message: 'Profile picture updated successfully',
          profilePicture,
        });
      } else {
        // Create a new ProfilePicture document
        const newProfilePicture = new ProfilePicture({
          studentId: userId,
          profilePicture: {
            data: req.file.buffer,
            contentType: req.file.mimetype,
          },
        });
  
        // Save the new ProfilePicture document to the database
        const savedProfilePicture = await newProfilePicture.save();
  
        res.status(200).json({
          message: 'Profile picture uploaded successfully',
          profilePicture: savedProfilePicture,
        });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

export const getProfilePicture = async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Find the profile picture by studentId
      const user = await ProfilePicture.findOne({ studentId: userId });
  
      if (!user || !user.profilePicture || !user.profilePicture.data) {
        return res.status(404).json({ message: 'Profile picture not found' });
      }
  
      res.set('Content-Type', user.profilePicture.contentType);
      res.send(user.profilePicture.data);
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };