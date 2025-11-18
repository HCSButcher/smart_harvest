// models/User.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    _id: { type: String, required: true }, // Clerk userId
    firstName: String,
    lastName: String,
    email: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "farmer", "foodbank"],
      default: "farmer",
    },
    publicMetadata: Schema.Types.Mixed,
  },
  { timestamps: true, _id: false }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
