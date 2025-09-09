// Import the multer library for handling file uploads
import multer from "multer";

// Define storage settings using multer's diskStorage
const storage = multer.diskStorage({
    // Set the destination folder where uploaded files will be stored
    destination: function (req, file, cb) {
        // Files will be saved in the ./public/temp directory
        cb(null, "./public/temp");
    },
    
    // Set the filename to use for the uploaded file
    filename: function (req, file, cb) {
        // Use the original file name as-is
        cb(null, file.originalname);
    }
});

// Export the configured multer instance as `upload`
export const upload = multer({ 
    storage, // Use the above storage configuration
});
