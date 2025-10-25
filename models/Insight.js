const mongoose = require("mongoose");

const insightSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { timestamps: true }
);

const Insight = mongoose.model("Insight", insightSchema);
module.exports = Insight;
