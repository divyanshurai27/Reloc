import mongoose from "mongoose";

const comboSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    description: String,
    city: {
      type: String,
      required: true
    },
    items: [
      {
        name: String,
        condition: String,
        image: String
      }
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Combo", comboSchema);
