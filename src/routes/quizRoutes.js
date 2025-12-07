const express = require("express");
const router = express.Router();

const quizController = require("../controllers/quizController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.post("/", auth, role("teacher"), quizController.createFullQuiz);
router.get("/", auth, role("teacher"), quizController.listQuizzes);
router.get("/:id", auth, quizController.getQuiz);

module.exports = router;
