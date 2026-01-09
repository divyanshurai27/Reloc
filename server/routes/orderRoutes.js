import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Combo from "../models/Combo.js";

const router = express.Router();

// Protect middleware using JWT
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "No token provided" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Buyer places order
router.post("/place", protect, async (req, res) => {
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

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Seller/Delivery/Admin updates order status
router.put("/status/:orderId", protect, async (req, res) => {
  const { status, note } = req.body;

  if (!["seller", "delivery", "admin"].includes(req.user.role)) {
    return res.status(401).json({ error: "Not allowed to update order" });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.orderId))
      return res.status(400).json({ error: "Invalid Order ID" });

    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Only the assigned seller OR admin can modify seller's order
    if (req.user.role === "seller" && order.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ error: "You can only update your own orders" });
    }

    order.status = status;
    if (note) order.inspectionNote = note;

    // Auto mark paid when pickup is scheduled
    if (status === "Pickup Scheduled") order.paymentStatus = "Paid";

    await order.save();
    res.json({ message: "Status updated", order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Optional moderation API: Admin deletes order
router.delete("/remove/:orderId", protect, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(401).json({ error: "Only admin can remove orders" });

  try {
    await Order.findByIdAndDelete(req.params.orderId);
    res.json({ success: true, message: "Order removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
