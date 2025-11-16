// models/Produce.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const produceSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String }, // e.g. Maize, Tomatoes
    quantity: { type: Number, required: true },
    contact: { type: Number, required: true },
    unit: { type: String, default: "kg" },
    price: { type: Number, default: 0 },
    farmerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    farmerName: { type: String },
    farmerEmail: { type: String },
    sold: { type: Boolean, default: false },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Produce || mongoose.model("Produce", produceSchema);
