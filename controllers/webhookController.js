const express = require("express");
const dotenv = require("dotenv").config();
const asyncHandler = require("express-async-handler");
const { Webhook } = require("svix");
const { Clerk } = require("@clerk/clerk-sdk-node"); // ✅ Correct import

// Initialize Clerk with your secret key
const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

// Webhook endpoint for IntaSend
const intasendWebHook = asyncHandler(async (req, res) => {
  try {
    const event = req.body;

    // Example: event payload contains payment details
    if (event.status === "PAID" && event.email) {
      // Find Clerk user with matching email
      const users = await clerk.users.getUserList({
        emailAddress: [event.email],
      });

      const user = users?.data?.[0];
      if (user) {
        // Update user's public metadata
        await clerk.users.updateUser(user.id, {
          publicMetadata: { subscribed: true },
        });

        console.log(`✅ Subscription activated for ${event.email}`);
      } else {
        console.warn(`⚠️ No user found for email: ${event.email}`);
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.status(500).json({ error: "Webhook failed" });
  }
});

module.exports = { intasendWebHook };
