const { groq } = require("../lib/grok.js");
const Insight = require("../models/Insight.js");
const User = require("../models/User.js");
const asyncHandler = require("express-async-handler");
const { clerkClient } = require("@clerk/clerk-sdk-node");

/**
 * AI RECOMMENDATION ENGINE
 */
const AiRecommendation = asyncHandler(async (req, res) => {
  const { farmerData, demandData, userId } = req.body;

  if (!userId)
    return res.status(400).json({ success: false, message: "Missing userId" });

  // 🔍 Fetch Clerk user
  let clerkUser;
  try {
    clerkUser = await clerkClient.users.getUser(userId);
  } catch (err) {
    console.error("Failed to fetch Clerk user:", err.message);
    return res
      .status(400)
      .json({ success: false, message: "Invalid Clerk user" });
  }

  // 🔄 Sync Clerk → MongoDB
  const userPayload = {
    _id: userId,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    email: clerkUser.emailAddresses?.[0]?.emailAddress,
    role: clerkUser.publicMetadata?.role || "farmer",
    publicMetadata: clerkUser.publicMetadata || {},
  };

  await User.findByIdAndUpdate(userId, userPayload, { upsert: true });

  const prompt = farmerData
    ? `You are SmartHarvest AI. A farmer has ${farmerData.quantity}kg of ${farmerData.type} in ${farmerData.location}. Suggest which foodbanks should receive it, minimizing waste and transport cost.`
    : `You are SmartHarvest AI. A foodbank requests: ${demandData.text}. Suggest relevant farmers who can supply this.`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
    });

    const recommendation = completion.choices[0].message.content;

    res.json({
      success: true,
      recommendation,
      user: userPayload,
    });
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    res.status(500).json({ success: false, message: "AI service failed" });
  }
});

/**
 * AI INSIGHTS
 */
const AiInsights = asyncHandler(async (req, res) => {
  try {
    const { question, userId } = req.body;

    if (!question || !userId)
      return res.status(400).json({ error: "Missing question or userId" });

    // 🔍 Fetch Clerk user
    let clerkUser;
    try {
      clerkUser = await clerkClient.users.getUser(userId);
    } catch (e) {
      console.error("Clerk error:", e.message);
      return res.status(400).json({ error: "Invalid Clerk user" });
    }

    // 🔄 Sync Clerk → MongoDB
    const userDoc = {
      _id: userId,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      email: clerkUser.emailAddresses[0].emailAddress,
      role: clerkUser.publicMetadata.role || "farmer",
      publicMetadata: clerkUser.publicMetadata || {},
    };

    await User.findByIdAndUpdate(userId, userDoc, { upsert: true });

    // 🔮 Groq AI response
    const aiResponse = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content:
            "You are SmartHarvest AI, an intelligent assistant helping farmers and foodbanks.",
        },
        { role: "user", content: question },
      ],
    });

    const answer = aiResponse.choices[0].message.content;

    // 📝 Save insight
    const newInsight = await Insight.create({
      userId,
      question,
      answer,
      userEmail: clerkUser.emailAddresses[0].emailAddress,
      role: userDoc.role,
    });

    res.json({ success: true, insight: newInsight });
  } catch (error) {
    console.error("AI Insight error:", error);
    res.status(500).json({ error: "AI service failed" });
  }
});

module.exports = {
  AiRecommendation,
  AiInsights,
};
