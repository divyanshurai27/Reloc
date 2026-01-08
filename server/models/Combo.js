import mongoose from "mongoose";

const comboSchema = new mongoose.Schema({
  comboName: { type: String, required: true },
  price: { type: Number, required: true }, // we only use price now ✔
  description: String,
  city: { type: String, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, enum: ["furniture", "electronics", "kitchen", "relocation", "others"], default: "relocation" }
}, { timestamps: true });

export default mongoose.model("Combo", comboSchema);
