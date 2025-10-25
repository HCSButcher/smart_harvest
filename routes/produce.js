const express = require("express");
const {
  getProduce,
  createProduce,
} = require("../controllers/produceController.js");

const router = express.Router();

router.get("/", getProduce);
router.post("/", createProduce);

module.exports = router;
