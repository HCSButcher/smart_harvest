const express = require("express");
const router = express.Router();
const {
  createPurchase,
  getPurchasesByUser,
} = require("../controllers/purchaseController");

// Create a new purchase + IntaSend payment
router.post("/create", createPurchase);

// Get all purchases for a specific foodbank (buyer)
router.get("/user/:userId", getPurchasesByUser);

module.exports = router;
