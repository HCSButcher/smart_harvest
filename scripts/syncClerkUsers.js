// scripts/syncClerkUsers.js
require("dotenv").config();
const mongoose = require("mongoose");
const { Clerk } = require("@clerk/backend");
const User = require("../models/User.js");

const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

async function syncClerkUsers() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);

    console.log("🔄 Fetching users from Clerk...");
    const allUsers = await clerk.users.getUserList({ limit: 500 });

    console.log(`📦 Found ${allUsers.length} Clerk users`);

    let created = 0;
    let updated = 0;

    for (const clerkUser of allUsers) {
      const email = clerkUser.emailAddresses?.[0]?.emailAddress;
      const role = clerkUser.publicMetadata?.role || "user";
      const subscribed = clerkUser.publicMetadata?.subscribed ?? false;

      const data = {
        clerkId: clerkUser.id,
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        email,
        role,
        publicMetadata: {
          subscribed,
        },
      };

      // check if exists
      const existing = await User.findOne({
        $or: [{ clerkId: clerkUser.id }, { email }],
      });

      if (existing) {
        await User.updateOne({ _id: existing._id }, data);
        updated++;
      } else {
        await User.create(data);
        created++;
      }
    }

    console.log("✅ Migration complete!");
    console.log(`🆕 Created: ${created}`);
    console.log(`♻️ Updated: ${updated}`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

syncClerkUsers();
