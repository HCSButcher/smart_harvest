const mongoose = require("mongoose");
const { Schema } = mongoose;

const aiLogSchema = new Schema(
  {
    userId: { type: String, required: true }, // Clerk userId
    userEmail: { type: String }, // optional, fetched from Clerk
    role: { type: String }, // e.g., farmer, foodbank
    question: { type: String, required: true },
    answerPreview: { type: String }, // short preview of AI answer
    cost: { type: Number, default: 0 }, // optional usage cost
    metadata: { type: Schema.Types.Mixed }, // optional extra info
  },
  { timestamps: true }
);

module.exports = mongoose.models.AiLog || mongoose.model("AiLog", aiLogSchema);
