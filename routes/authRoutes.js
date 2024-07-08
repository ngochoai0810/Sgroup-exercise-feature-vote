const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");


router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/userz", authMiddleware, authController.getUsers);
router.post("/forgot-password", authController.sendMail);
router.post("/reset-password", authController.resetPassword);
module.exports = router;
