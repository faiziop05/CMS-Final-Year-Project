import multer from 'multer';

// Configure multer storage
const storage = multer.memoryStorage(); // Use memory storage to get the file buffer
const upload = multer({ storage });

export default upload;
