const mongoose = require("mongoose");

const insightSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Clerk userId
    userEmail: { type: String }, // optional, fetched from Clerk
    question: { type: String, required: true },
    answer: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed }, // optional extra info
  },
  { timestamps: true }
);

const Insight =
  mongoose.models.Insight || mongoose.model("Insight", insightSchema);

module.exports = Insight;
