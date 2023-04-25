// const multer = require('multer');
// const path = require('path');


// const tempDir = path.join(__dirname, "..", "temp");

// const multerConfig = multer.diskStorage({
//     destination: tempDir,
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     }
// });

// const upload = multer({
//     storage: multerConfig,
// })

// module.exports = upload;


// const multer = require("multer");
// const path = require("path");

// const tempDir = path.join(__dirname, "..", "temp");
// console.log(tempDir, "pyt tyda")

// const multerConfig = multer.diskStorage({
//   destination: tempDir,
//     filename: (req, file, cb) => {
//       console.log(file, "file")
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({
    
//   storage: multerConfig,
// });
// console.log(upload, "upload")

// module.exports = upload;


const multer = require("multer");
const path = require("path");

const tempDir = path.join(__dirname, "../", "temp");

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
    storage: multerConfig,
    
});

module.exports = upload;