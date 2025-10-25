const express = require("express");
const router = express.Router();
const {
  AiRecommendation,
  AiInsights,
} = require("../controllers/aiController.js");

router.post("/recommend", AiRecommendation);
router.post("/insights", AiInsights);

module.exports = router;
