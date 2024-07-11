const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  authMiddleware,
  authorAdmin,
} = require("../middleware/authMiddleware");
const voteController = require("../controllers/voteController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/userz", authMiddleware, authController.getUsers);
router.post("/forgot-password", authController.sendMail);
router.post("/reset-password", authController.resetPassword);
router.post("/voter", voteController.voteForCandidate);
router.get("/voters", voteController.getVotes);
router.get("/polls", voteController.readPoll);
router.get("/polls/:id", voteController.readPollbyid);
router.post("/poll", authMiddleware, authorAdmin, voteController.createPoll);
router.put(
  "/poll/:id",
  authMiddleware,
  authorAdmin,
  voteController.updatePoll
);
router.delete(
  "/poll/:id",
  authMiddleware,
  authorAdmin,
  voteController.deletePoll
);
router.get("/options", voteController.getOption);
router.get("/options/:id", voteController.getOptionbyid);
router.post("/option", voteController.createOption);
router.post("/vote", voteController.voting);
router.delete("/vote", voteController.unvoting);

module.exports = router;
