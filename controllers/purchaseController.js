const asyncHandler = require("express-async-handler");
const Purchase = require("../models/Purchase");
const Produce = require("../models/Produce");
const axios = require("axios");

// IntaSend setup
const INTA_API_KEY = process.env.INTASEND_API_KEY;
const INTA_BASE_URL = "https://www.intasend.com/api/v1";

// Create purchase + generate payment
const createPurchase = asyncHandler(async (req, res) => {
  const { cartItems, buyerId, buyerEmail, redirectUrl } = req.body;

  if (!cartItems || !cartItems.length || !buyerId || !redirectUrl) {
    return res
      .status(400)
      .json({ success: false, message: "Missing fields in request" });
  }

  try {
    let totalAmount = 0;

    // Ensure all items have a valid produceId and quantity
    const sanitizedCart = cartItems.map((item) => ({
      produceId: item.produceId || item._id,
      quantity: item.quantity || 1,
    }));

    // Create purchase records in MongoDB (status: PENDING)
    const purchaseRecords = await Promise.all(
      sanitizedCart.map(async (item) => {
        const produce = await Produce.findById(item.produceId);
        if (!produce) {
          throw new Error(`Produce not found: ${item.produceId}`);
        }

        const amount = item.quantity * produce.price;
        totalAmount += amount;

        return await Purchase.create({
          produceId: produce._id,
          buyerId,
          buyerEmail,
          farmerId: produce.farmerId,
          farmerEmail: produce.farmerEmail,
          quantity: item.quantity,
          amount,
          currency: "KES",
          status: "PENDING",
        });
      })
    );

    // Create IntaSend payment request
    const paymentPayload = {
      amount: totalAmount,
      currency: "KES",
      reference: `purchase_${Date.now()}`,
      callback_url: redirectUrl,
      email: buyerEmail,
      metadata: {
        purchaseIds: purchaseRecords.map((p) => p._id),
      },
    };

    const response = await axios.post(
      `${INTA_BASE_URL}/payments`,
      paymentPayload,
      {
        headers: { Authorization: `Bearer ${INTA_API_KEY}` },
      }
    );

    // Log for debugging
    console.log("IntaSend response:", response.data);

    return res.status(200).json({
      success: true,
      checkoutUrl: response.data.data.checkout_url,
      purchases: purchaseRecords,
    });
  } catch (err) {
    console.error(
      "IntaSend or purchase error:",
      err.response?.data || err.message
    );
    return res.status(500).json({
      success: false,
      message: "Purchase creation or payment failed",
    });
  }
});

// Fetch purchases for a foodbank (by buyerId)
const getPurchasesByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ success: false, message: "Missing userId" });
  }

  try {
    const purchases = await Purchase.find({ buyerId: userId })
      .populate("produceId")
      .sort({ createdAt: -1 });

    return res.json({ success: true, purchases });
  } catch (err) {
    console.error("Failed to fetch purchases:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Could not fetch purchases" });
  }
});

module.exports = { createPurchase, getPurchasesByUser };
