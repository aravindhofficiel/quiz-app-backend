const express = require("express");
const router = express.Router();

// IMPORT CONTROLLERS AND MIDDLEWARE FIRST
const questionCtrl = require("../controllers/questionController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// DEBUG LOGS - SAFE NOW
console.log("AUTH MIDDLEWARE LOADED:", typeof auth);
console.log("ROLE MIDDLEWARE LOADED:", typeof role);
console.log("QUESTION CONTROLLER:", questionCtrl);

// PROTECT ALL ROUTES (AUTH + ROLE)
router.use(auth);
router.use(role("teacher"));

// ROUTES
router.post("/", questionCtrl.create);
router.get("/", questionCtrl.list);
router.put("/:id", questionCtrl.update);
router.delete("/:id", questionCtrl.remove);

module.exports = router;
