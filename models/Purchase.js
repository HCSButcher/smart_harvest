const mongoose = require("mongoose");
const { Schema } = mongoose;

const purchaseSchema = new Schema(
  {
    produceId: { type: Schema.Types.ObjectId, ref: "Produce", required: true },

    // Use Clerk userId for buyer (foodbank)
    buyerId: { type: String, required: true },
    buyerEmail: { type: String }, // optional, fetched from Clerk

    // Use Clerk userId for farmer
    farmerId: { type: String },
    farmerEmail: { type: String }, // optional, fetched from Clerk

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
