import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  city: String,
  role: { type: String, enum: ["buyer", "seller", "delivery", "admin"], default: "buyer" }
});

export default mongoose.model("User", userSchema);
