const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// Admin-only routes
router.get("/", auth, role("admin"), userCtrl.getUsers);
router.post("/", auth, role("admin"), userCtrl.createUser);
router.delete("/:id", auth, role("admin"), userCtrl.deleteUser);

module.exports = router;
