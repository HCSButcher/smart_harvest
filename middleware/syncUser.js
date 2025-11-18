// middleware/syncUser.js
const User = require("../models/User");
const { clerkClient } = require("@clerk/clerk-sdk-node");

module.exports = async function syncUser(req, res, next) {
  try {
    const authUserId = req.auth?.userId;
    if (!authUserId) return next();

    let mongoUser = await User.findById(authUserId);

    if (!mongoUser) {
      // fetch Clerk user details
      const clerkUser = await clerkClient.users.getUser(authUserId);

      mongoUser = await User.create({
        _id: clerkUser.id,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        email: clerkUser.emailAddresses[0].emailAddress,
        role: clerkUser.publicMetadata?.role || "farmer",
        publicMetadata: clerkUser.publicMetadata || {},
      });
    }

    next();
  } catch (err) {
    console.error("Sync user error", err.message);
    next();
  }
};
