import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comboId: { type: mongoose.Schema.Types.ObjectId, ref: "Combo", required: true },
  status: { 
    type: String, 
    enum: ["placed", "pickup_requested", "inspected", "out_for_delivery", "delivered"], 
    default: "placed" 
  },
  inspectionNote: String,
  deliveryAddress: String,
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
