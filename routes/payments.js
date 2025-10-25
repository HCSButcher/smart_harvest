const express = require("express");
const router = express.Router();
const {
  createCheckout,
  verifyStatus,
} = require("../controllers/paymentController.js");

router.post("/create-checkout", createCheckout);
router.post("/verify-status", verifyStatus);

module.exports = router;
