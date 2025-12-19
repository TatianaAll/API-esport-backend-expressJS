const multer = require('multer'); // import multer for handling file uploads
const path = require('path');  // import path module for handling file paths

// Configure storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'imageUploads/'); // specify the destination directory
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // create a unique suffix for the file name
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

// File filter to allow only specific file types ==> images in that case
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif/;
  const mimetype = allowedFileTypes.test(file.mimetype); // test the extension of the mimetype
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase()); // pass the file extension test
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'));
  }
};

// Initialize multer with the defined storage and file filter
const upload = multer({
  storage: storage, // the directory and the filename suffixe
  limits: { fileSize: 1024 * 1024 * 5 }, // limit file size to 5MB
  fileFilter: fileFilter // filter to allow only images
});

module.exports = upload;
