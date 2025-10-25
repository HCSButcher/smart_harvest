const axios = require("axios");
const asyncHandler = require("express-async-handler");
require("dotenv").config();

const INTASEND_BASE =
  process.env.INTASEND_ENVIRONMENT === "sandbox"
    ? "https://sandbox.intasend.com/api/v1"
    : "https://payment.intasend.com/api/v1";

const createCheckout = asyncHandler(async (req, res) => {
  try {
    const { email, amount, description } = req.body;

    const { data } = await axios.post(
      `${INTASEND_BASE}/checkout/`,
      {
        public_key: process.env.INTASEND_PUBLIC_KEY,
        amount,
        currency: "KES",
        email,
        description,
        redirect_url: `${process.env.BASE_URL}/subscribe/success`, // Redirect after payment
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.INTASEND_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      success: true,
      checkout_url: data.url,
    });
  } catch (err) {
    console.error("IntaSend error:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Failed to create checkout",
    });
  }
});

const verifyStatus = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    // Step 1: Fetch payments linked to this email from IntaSend
    const { data } = await axios.get(`${INTASEND_BASE}/checkout/`, {
      headers: {
        Authorization: `Bearer ${process.env.INTASEND_SECRET_KEY}`,
      },
      params: { email },
    });

    // Step 2: Check if any payment has status PAID
    const hasPaid = data.results?.some(
      (txn) => txn.status === "PAID" || txn.status === "COMPLETED"
    );

    if (hasPaid) {
      const users = await clerk.users.getUserList({ emailAddress: [email] });
      const user = users?.[0];
      if (user) {
        await clerk.users.updateUser(user.id, {
          publicMetadata: { subscribed: true },
        });
      }
    }

    res.status(200).json({ success: true, subscribed: hasPaid });
  } catch (err) {
    console.error("Verification error:", err.response?.data || err.message);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});
module.exports = { createCheckout, verifyStatus };
