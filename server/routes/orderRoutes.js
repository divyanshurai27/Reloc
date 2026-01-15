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

// BUYER places order
router.post("/place", protect, async (req, res) => {
  const { comboId, deliveryAddress } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(comboId))
      return res.status(400).json({ error: "Invalid Combo ID" });

    const combo = await Combo.findById(comboId);
    if (!combo) return res.status(404).json({ error: "Combo not found" });

    const order = await Order.create({
      buyerId: req.user.id,
      sellerId: combo.seller,       
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

// SELLER / ADMIN updates order status
router.put("/status/:orderId", protect, async (req, res) => {
  const { status, note } = req.body;

  if (!["seller", "admin"].includes(req.user.role)) {
    return res.status(401).json({ error: "Not allowed to update order" });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.orderId))
      return res.status(400).json({ error: "Invalid Order ID" });

    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Seller can update only their orders
    if (
      req.user.role === "seller" &&
      order.sellerId.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: "You can only update your own orders" });
    }

    order.status = status;
    if (note) order.inspectionNote = note;

    if (status === "Pickup Scheduled") {
      order.paymentStatus = "Paid";
    }

    await order.save();
    res.json({ message: "Status updated", order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET BUYER ORDERS (DASHBOARD)
router.get("/buyer", protect, async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user.id })
      .populate("comboId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET SELLER ORDERS (DASHBOARD)
router.get("/seller", protect, async (req, res) => {
  try {
    const orders = await Order.find({ sellerId: req.user.id })
      .populate("comboId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN deletes order
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
