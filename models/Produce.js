const mongoose = require("mongoose");
const { Schema } = mongoose;

const produceSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String },
    quantity: { type: Number, required: true },
    contact: { type: Number, required: true },

    unit: { type: String, default: "kg" },
    price: { type: Number, default: 0 },

    location: { type: String, required: true }, // ✅ ADD THIS FIELD

    farmerId: { type: String, ref: "User", required: true }, // Clerk ID
    farmerName: String,
    farmerEmail: String,

    sold: { type: Boolean, default: false },
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Produce || mongoose.model("Produce", produceSchema);
