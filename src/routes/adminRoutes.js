const express = require("express");
const router = express.Router();
const adminCtrl = require("../controllers/adminController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// ONLY admins can access
router.use(auth, role("admin"));

router.get("/users", adminCtrl.getAllUsers);
router.post("/users", adminCtrl.createUser);
router.delete("/users/:id", adminCtrl.deleteUser);

router.get("/quizzes", adminCtrl.getAllQuizzes);
router.get("/leaderboard", adminCtrl.getLeaderboard);

module.exports = router;
