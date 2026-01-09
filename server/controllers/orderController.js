import Order from "../models/Order.js";
import Combo from "../models/Combo.js";
import mongoose from "mongoose";

export const placeOrder = async (req, res) => {
  const { comboId, deliveryAddress } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(comboId))
      return res.status(400).json({ error: "Invalid Combo ID" });

    const combo = await Combo.findById(comboId);
    if (!combo) return res.status(404).json({ error: "Combo not found" });

    const order = await Order.create({
      buyerId: req.user.id,
      sellerId: combo.sellerId,
      comboId: combo._id,
      deliveryAddress,
      status: "Pending",
      paymentStatus: "Unpaid",
      inspectionNote: ""
    });

    res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user.id }).populate("comboId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ sellerId: req.user.id }).populate("comboId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStatus = async (req, res) => {
  const { status, note } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.orderId))
      return res.status(400).json({ error: "Invalid Order ID" });

    const order = await Order.findById(req.params.orderId).populate("comboId");
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Seller-only status update protection
    if (order.sellerId.toString() !== req.user.id)
      return res.status(403).json({ error: "Only seller can update status" });

    order.status = status;

    // Inspection note update if provided
    if (note) order.inspectionNote = note;

    // Payment auto-update example when pickup is scheduled
    if (status === "Pickup Scheduled") order.paymentStatus = "Paid";

    await order.save();
    res.json({ message: "Status updated", order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin moderation API (extra but useful for portfolio)
export const deleteOrder = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.orderId))
      return res.status(400).json({ error: "Invalid Order ID" });

    await Order.findByIdAndDelete(req.params.orderId);
    res.json({ success: true, message: "Order removed by admin/moderator" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
