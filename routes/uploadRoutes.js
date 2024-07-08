const express = require("express");
const router = express.Router();
const upload = require("../uploadConfig");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/uploadfile",authMiddleware, upload.single("file"), (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send(file);
});

module.exports = router;
