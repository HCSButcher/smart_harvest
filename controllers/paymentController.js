const axios = require("axios");
const asyncHandler = require("express-async-handler");
const { clerkClient } = require("@clerk/clerk-sdk-node");
const User = require("../models/User.js");
require("dotenv").config();

// Determine base URL based on environment
const INTASEND_BASE =
  process.env.INTASEND_ENVIRONMENT === "sandbox"
    ? "https://sandbox.intasend.com/api/v1"
    : "https://payment.intasend.com/api/v1";

/**
 * CREATE CHECKOUT SESSION
 */
const createCheckout = asyncHandler(async (req, res) => {
  try {
    const { email, amount, description } = req.body;

    if (!email || !amount || !description) {
      return res.status(400).json({
        success: false,
        message: "Missing email, amount, or description",
      });
    }

    const { data } = await axios.post(
      `${INTASEND_BASE}/checkout/`,
      {
        public_key: process.env.INTASEND_PUBLIC_KEY,
        amount,
        currency: "KES",
        email,
        description,
        redirect_url: `${process.env.FRONTEND_URL}/subscribe/success`,
      },
      { timeout: 20000 }
    );

    return res.status(200).json({
      success: true,
      checkout_url: data.url,
    });
  } catch (err) {
    console.error(
      "IntaSend createCheckout error:",
      err.response?.data || err.message
    );

    return res.status(500).json({
      success: false,
      message:
        err.response?.data?.errors?.[0]?.detail ||
        "Problem experienced while processing your request. Please contact support.",
    });
  }
});

/**
 * VERIFY PAYMENT STATUS AND SYNC TO CLERK + MONGODB
 */
const verifyStatus = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    // Server-side verification with secret key
    const { data } = await axios.get(`${INTASEND_BASE}/checkout/`, {
      headers: {
        Authorization: `Bearer ${process.env.INTASEND_SECRET_KEY}`,
      },
      params: { email },
      timeout: 20000,
    });

    const hasPaid = data.results?.some(
      (txn) => txn.status === "PAID" || txn.status === "COMPLETED"
    );

    if (hasPaid) {
      // Get Clerk user
      const users = await clerkClient.users.getUserList({
        emailAddress: [email],
      });
      const clerkUser = users?.[0];

      if (clerkUser) {
        // Update Clerk subscription metadata
        await clerkClient.users.updateUser(clerkUser.id, {
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
      }
    }

    return res.status(200).json({ success: true, subscribed: hasPaid });
  } catch (err) {
    console.error(
      "IntaSend verifyStatus error:",
      err.response?.data || err.message
    );
    return res.status(500).json({
      success: false,
      message:
        err.response?.data?.errors?.[0]?.detail ||
        "Verification failed. Please contact support.",
    });
  }
});

module.exports = { createCheckout, verifyStatus };
