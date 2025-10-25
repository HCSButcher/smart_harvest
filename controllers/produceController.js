const Produce = require("../models/Produce.js");
const asyncHandler = require("express-async-handler");

//GET all produce
const getProduce = asyncHandler(async (req, res) => {
  try {
    const data = await Produce.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    console.error("Error fetching produce", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching produce",
    });
  }
});

// Upload produce
const createProduce = asyncHandler(async (req, res) => {
  try {
    const produce = new Produce(req.body);
    await produce.save();
    res.status(200).json(
      {
        success: true,
        message: "Produce created successfully",
      },
      produce
    );
  } catch (error) {
    console.error("Failed to create produce", error.message);
    res.status(400).json({
      success: false,
      message: "Error creating produce",
    });
  }
});

module.exports = {
  getProduce,
  createProduce,
};
