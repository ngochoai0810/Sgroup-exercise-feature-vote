const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");
const port = 3000;

const app = express();

// app.use(bodyParser.urlencoded({ extended: true }));

// app.post("/uploadfile", upload.single("myFile"), (req, res, next) => {
//   const file = req.file;
//   if (!file) {
//     const error = new Error("Please upload a file");
//     error.httpStatusCode = 400;
//     return next(error);
//   }
//   res.send(file);
// });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

app.post("/uploadfile", upload.single("file"), (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send(file);
});

app.use(express.static(__dirname + "/public"));

app.listen(port, () => {
  console.log(`Server started http://localhost:${port}`);
});
