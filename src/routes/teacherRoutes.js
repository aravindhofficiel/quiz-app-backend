const express = require("express");
const router = express.Router();
const teacherCtrl = require("../controllers/teacherController");
const quizCtrl = require("../controllers/quizController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const teacherController = require("../controllers/teacherController");


// Only teachers allowed
router.use(auth, role("teacher"));

// QUESTIONS CRUD
router.post("/questions", teacherCtrl.createQuestion);
router.get("/questions", teacherCtrl.listQuestions);
router.put("/questions/:id", teacherCtrl.updateQuestion);
router.delete("/questions/:id", teacherCtrl.deleteQuestion);

// QUIZ ROUTES (THIS WAS MISSING!)
router.post("/quizzes", quizCtrl.createFullQuiz);
router.get("/quizzes", quizCtrl.listQuizzes);
router.get("/quizzes/:id", quizCtrl.getQuiz);

// RESULTS
router.get("/results", teacherCtrl.listResults);
router.get("/results", auth, role("teacher"), teacherController.listResults);


module.exports = router;
