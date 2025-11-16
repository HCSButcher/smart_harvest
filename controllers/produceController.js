const Produce = require("../models/Produce.js");
const asyncHandler = require("express-async-handler");
const { clerkClient } = require("@clerk/clerk-sdk-node");

// GET all produce with farmer name from Clerk
const getProduce = asyncHandler(async (req, res) => {
  try {
    const data = await Produce.find().sort({ createdAt: -1 });

    const dataWithFarmerNames = await Promise.all(
      data.map(async (item) => {
        let farmerName = item.farmerName || "Unknown";

        // Fetch farmer name from Clerk if farmerId exists
        try {
          if (item.farmerId) {
            const clerkUser = await clerkClient.users.getUser(
              item.farmerId.toString()
            );
            farmerName = `${clerkUser.firstName} ${clerkUser.lastName}`;
          }
        } catch (err) {
          console.error(`Clerk error for user ${item.farmerId}:`, err.message);
        }

        return {
          _id: item._id,
          name: item.name, // produce name
          type: item.type,
          quantity: item.quantity,
          unit: item.unit,
          price: item.price,
          farmerId: item.farmerId,
          farmerEmail: item.farmerEmail,
          farmerName,
          contact: item.contact,
          createdAt: item.createdAt,
        };
      })
    );

    res.status(200).json(dataWithFarmerNames);
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
    res.status(200).json({
      success: true,
      message: "Produce created successfully",
      data: produce,
    });
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
