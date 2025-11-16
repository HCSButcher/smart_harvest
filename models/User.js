// models/User.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    clerkId: { type: String }, // optional: Clerk user id
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["farmer", "foodbank", "admin", "user"],
      default: "user",
    },
    publicMetadata: { type: Schema.Types.Mixed, default: {} }, // stores subscribed, etc
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
