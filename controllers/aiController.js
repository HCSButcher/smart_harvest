const { openai } = require("../lib/openai.js");
const Insight = require("../models/Insight.js");
const asyncHandler = require("express-async-handler");

const AiRecommendation = asyncHandler(async (req, res) => {
  const { farmerData, demandData } = req.body;

  try {
    const prompt = farmerData
      ? `You are SmartHarvest AI. The farmer has ${farmerData.quantity}kg of ${farmerData.type} in ${farmerData.location}. Suggest which foodbanks should receive it and how to reduce waste.`
      : `You are SmartHarvest AI. A foodbank requests: ${demandData.text}. Suggest matching farmers who might fulfill this.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-40-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const recommendation = completion.choices[0].message.content;
    res.json({ recommendation, success: true });
  } catch (error) {}
});

const AiInsights = asyncHandler(async (req, res) => {
  try {
    const { question, userId } = req.body;

    if (!question || !userId)
      return res.status(400).json({ error: "Missing question or userId" });

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Smart Harvest AI, an assistant helping farmers and foodbanks.",
        },
        { role: "user", content: question },
      ],
    });

    const answer = aiResponse.choices[0].message.content;

    const newInsight = await Insight.create({
      userId,
      question,
      answer,
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
