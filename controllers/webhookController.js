const asyncHandler = require("express-async-handler");
const { Clerk } = require("@clerk/clerk-sdk-node");
const User = require("../models/User.js");
require("dotenv").config();

// Initialize Clerk
const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

/**
 * IntaSend Webhook Endpoint
 */
const intasendWebHook = asyncHandler(async (req, res) => {
  try {
    const event = req.body;

    // Only handle completed/paid transactions
    if (
      (event.status === "PAID" || event.status === "COMPLETED") &&
      event.email
    ) {
      // Get Clerk user by email
      const users = await clerk.users.getUserList({
        emailAddress: [event.email],
      });
      const clerkUser = users?.[0];

      if (clerkUser) {
        // Update subscription in Clerk
        await clerk.users.updateUser(clerkUser.id, {
          publicMetadata: { ...clerkUser.publicMetadata, subscribed: true },
        });

        // Sync user to MongoDB (upsert)
        const mongoUser = {
          _id: clerkUser.id,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          email: clerkUser.emailAddresses?.[0]?.emailAddress,
          role: clerkUser.publicMetadata?.role || "farmer",
          publicMetadata: { ...clerkUser.publicMetadata, subscribed: true },
        };

        await User.findByIdAndUpdate(clerkUser.id, mongoUser, { upsert: true });

        console.log(`✅ Subscription activated for ${event.email}`);
      } else {
        console.warn(`⚠️ No Clerk user found for email: ${event.email}`);
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.status(500).json({ error: "Webhook failed" });
  }
});

module.exports = { intasendWebHook };
