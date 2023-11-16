const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads'); // Specify the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Use a unique filename for each uploaded file
    },
  });

  const upload = multer({storage:storage});

  module.exports = upload;