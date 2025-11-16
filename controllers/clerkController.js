const dotenv = require("dotenv").config();
const { clerkClient } = require("@clerk/clerk-sdk-node");
const asyncHandler = require("express-async-handler");

const clerkData = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;

  if (!userId || !role) {
    return res
      .status(400)
      .json({ success: false, message: "Missing userId or role" });
  }

  try {
    // Check if user exists in Clerk first
    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found in Clerk" });
    }

    // Update Clerk public metadata
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { role },
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("Clerk error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to set role",
      error: error.errors || error.message,
    });
  }
});

module.exports = { clerkData };
