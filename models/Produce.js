const mongoose = require("mongoose");

const produceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    farmerId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Produce = mongoose.model("Produce", produceSchema);

module.exports = Produce;
