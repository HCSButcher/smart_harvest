// routes/adminRoutes.js
const express = require("express");
const router = express.Router();

const {
  getOverview,
  getFarmers,
  getFoodbanks,
  getProduce,
  getUsers,
  getAnalytics,
  getAiUsage,
  getSales,
} = require("../controllers/adminController.js");

router.get("/overview", getOverview); // GET /api/admin/overview
router.get("/farmers", getFarmers); // GET /api/admin/farmers
router.get("/foodbanks", getFoodbanks); // GET /api/admin/foodbanks
router.get("/produce", getProduce); // GET /api/admin/produce
router.get("/users", getUsers); // GET /api/admin/users
router.get("/analytics", getAnalytics); // GET /api/admin/analytics
router.get("/ai-usage", getAiUsage); // GET /api/admin/ai-usage
router.get("/sales", getSales); // GET /api/admin/sales

module.exports = router;
