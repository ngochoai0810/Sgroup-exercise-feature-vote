const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const voteController = require("../controllers/voteController");



router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/userz", authMiddleware, authController.getUsers);
router.post("/forgot-password", authController.sendMail);
router.post("/reset-password", authController.resetPassword);
router.post("/vote", voteController.voteForCandidate);
router.get("/votes", voteController.getVotes);
router.post("/poll", voteController.createPoll);
router.post ("/option", voteController.createOption)

module.exports = router;
