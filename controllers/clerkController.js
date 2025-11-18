const dotenv = require("dotenv").config();
const { clerkClient } = require("@clerk/clerk-sdk-node");
const asyncHandler = require("express-async-handler");
const User = require("../models/User.js");

const clerkData = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;

  if (!userId || !role) {
    return res
      .status(400)
      .json({ success: false, message: "Missing userId or role" });
  }

  try {
    // Fetch user from Clerk
    const clerkUser = await clerkClient.users.getUser(userId);
    if (!clerkUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found in Clerk" });
    }

    // Update Clerk public metadata while preserving existing metadata
    const updatedMetadata = {
      ...clerkUser.publicMetadata,
      role,
    };
    await clerkClient.users.updateUser(userId, {
      publicMetadata: updatedMetadata,
    });

    // Sync to MongoDB (upsert)
    const mongoUser = {
      _id: clerkUser.id, // keep same as Clerk userId
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      email: clerkUser.emailAddresses?.[0]?.emailAddress,
      role,
      publicMetadata: updatedMetadata,
    };

    await User.findByIdAndUpdate(clerkUser.id, mongoUser, { upsert: true });

    return res.json({ success: true, message: "Role updated successfully" });
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
