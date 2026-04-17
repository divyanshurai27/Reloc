import mongoose from "mongoose";

const comboSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    estimatedPrice: { type: Number },
    description: String,
    city: { type: String, required: true },
    bundleType: {
      type: String,
      enum: ["1BHK Setup", "Kitchen Essentials", "Bedroom Combo", "Living Room", "Full Home Setup", "Custom Bundle"],
      default: "Custom Bundle"
    },
    sellingModel: {
      type: String,
      enum: ["Direct Resale", "Managed Consignment", "Instant Cashout"],
      default: "Direct Resale"
    },
    discountPercent: { type: Number, default: 0 },
    tags: [String],
    items: [
      {
        name: String,
        category: String,
        condition: { type: String, enum: ["New", "Good", "Used", "For Parts"], default: "Good" },
        age: { type: String, default: "< 1 year" },
        image: String,
        estimatedItemPrice: Number
      }
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    isWholeSetup: { type: Boolean, default: false },
    pickupDate: String,
    pickupTime: String,
  },
  { timestamps: true }
);

export default mongoose.model("Combo", comboSchema);
