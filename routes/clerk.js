const express = require("express");
const router = express.Router();
const { clerkData } = require("../controllers/clerkController");

router.post("/set-role", clerkData);

module.exports = router;
