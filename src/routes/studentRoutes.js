const express = require("express");
const router = express.Router();

const studentCtrl = require("../controllers/studentController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// STUDENT ONLY ACCESS
router.use(auth, role("student"));

// Get quizzes for student
router.get("/available-quizzes", studentCtrl.getAvailableQuizzes);

router.get("/quiz/:id", auth, role("student"), studentCtrl.getQuizForStudent);

router.post("/quiz/:id/submit", auth, role("student"), studentCtrl.submitQuiz); 


// Get student results
router.get("/results", studentCtrl.getStudentAttempts);

module.exports = router;
