const express = require("express");
const router = express.Router();
const { intasendWebHook } = require("../controllers/webhookController.js");

router.post("/intasend-webhook", intasendWebHook);

module.exports = router;
