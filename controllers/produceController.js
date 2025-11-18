// controllers/produceController.js
const Produce = require("../models/Produce");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const { clerkClient } = require("@clerk/clerk-sdk-node");

/* ======================================================
   GET ALL PRODUCE — pulls farmer info from MongoDB (fast)
   ====================================================== */
const getProduce = asyncHandler(async (req, res) => {
  try {
    const data = await Produce.find().sort({ createdAt: -1 });

    const formatted = await Promise.all(
      data.map(async (item) => {
        let farmerName = "Unknown";
        let farmerEmail = "Unknown";

        try {
          if (item.farmerId) {
            const farmer = await User.findById(item.farmerId);

            if (farmer) {
              farmerName = `${farmer.firstName} ${farmer.lastName}`.trim();
              farmerEmail = farmer.email;
            }
          }
        } catch (err) {
          console.error(
            `Error fetching farmer from Mongo (${item.farmerId}):`,
            err.message
          );
        }

        return {
          ...item.toObject(),
          farmerName,
          farmerEmail,
        };
      })
    );

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching produce:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching produce",
    });
  }
});

/* ======================================================
   CREATE PRODUCE — Clerk ID used as farmerId
   pulls farmerName + email automatically
   ====================================================== */
const createProduce = asyncHandler(async (req, res) => {
  try {
    const { farmerId } = req.body;

    if (!farmerId) {
      return res.status(400).json({
        success: false,
        message: "FarmerId is required",
      });
    }

    // Make sure the user exists in Mongo
    let farmer = await User.findById(farmerId);

    // If not, fetch from Clerk and create in MongoDB
    if (!farmer) {
      try {
        const clerkUser = await clerkClient.users.getUser(farmerId);

        farmer = await User.create({
          _id: clerkUser.id,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          email: clerkUser.emailAddresses[0].emailAddress,
          role: clerkUser.publicMetadata?.role || "farmer",
          publicMetadata: clerkUser.publicMetadata || {},
        });
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid farmerId (not found in Clerk)",
        });
      }
    }

    // Auto-fill farmer info in produce
    const produce = await Produce.create({
      ...req.body,
      farmerName: `${farmer.firstName} ${farmer.lastName}`.trim(),
      farmerEmail: farmer.email,
    });

    res.status(201).json({
      success: true,
      message: "Produce created successfully",
      data: produce,
    });
  } catch (error) {
    console.error("Failed to create produce:", error.message);
    res.status(500).json({
      success: false,
      message: "Error creating produce",
    });
  }
});

module.exports = {
  getProduce,
  createProduce,
};
