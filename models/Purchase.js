// models/Purchase.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const purchaseSchema = new Schema(
  {
    produceId: { type: Schema.Types.ObjectId, ref: "Produce", required: true },
    buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // foodbank
    buyerEmail: { type: String },
    farmerId: { type: Schema.Types.ObjectId, ref: "User" },
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true }, // total amount paid
    currency: { type: String, default: "KES" },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "CANCELLED"],
      default: "PAID",
    },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema);
