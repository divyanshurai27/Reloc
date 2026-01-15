import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    comboId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Combo",
      required: true
    },
    deliveryAddress: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Pickup Scheduled",
        "In Inspection",
        "Out for Delivery",
        "Delivered",
        "Cancelled"
      ],
      default: "Pending"
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid"],
      default: "Unpaid"
    },
    inspectionNote: String
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
