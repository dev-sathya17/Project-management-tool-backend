// Importing the multer library
const multer = require("multer");

// Creating a multer instance
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, `uploads/`);
  },
  filename: (req, file, callback) => {
    callback(
      null,
      new Date().toISOString().replace(/:/g, "-") + file.originalname
    );
  },
});

module.exports = multer({ storage: storage });
