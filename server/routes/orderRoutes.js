import express from "express";
import jwt from "jsonwebtoken";
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
    const combo = await Combo.findById(comboId);
    if (!combo) return res.status(404).json({ error: "Combo not found" });

    const order = await Order.create({
      buyerId: req.user.id,
      sellerId: combo.sellerId,
      comboId: combo._id,
      deliveryAddress,
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Seller or Delivery updates status
router.put("/status/:orderId", protect, async (req, res) => {
  const { status, note } = req.body;

  if (req.user.role !== "seller" && req.user.role !== "delivery" && req.user.role !== "admin") {
    return res.status(401).json({ error: "Not allowed to update order" });
  }

  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    if (note) order.inspectionNote = note;

    await order.save();
    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
