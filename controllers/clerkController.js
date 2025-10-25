const dotenv = require("dotenv").config();
const { clerkClient } = require("@clerk/clerk-sdk-node");
const asyncHandler = require("express-async-handler");

const clerkData = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;
  try {
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role },
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Clerk error:", error.message);
    res.json(500).json({
      success: false,
      message: "Failed to set role",
    });
  }
});

module.exports = { clerkData };
