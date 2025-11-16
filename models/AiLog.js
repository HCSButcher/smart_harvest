// models/AiLog.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const aiLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    userEmail: { type: String },
    role: { type: String },
    question: { type: String },
    answerPreview: { type: String },
    cost: { type: Number, default: 0 }, // optional usage cost
  },
  { timestamps: true }
);

module.exports = mongoose.models.AiLog || mongoose.model("AiLog", aiLogSchema);
