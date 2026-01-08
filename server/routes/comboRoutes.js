import express from "express";
import jwt from "jsonwebtoken";
import Combo from "../models/Combo.js";

const router = express.Router();

// Token protect middleware
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

// Create Combo API (no item IDs)
router.post("/create", protect, async (req, res) => {
  const { comboName, price, description, city, category } = req.body;

  if (req.user.role !== "seller" && req.user.role !== "admin") {
    return res.status(401).json({ error: "Only seller or admin can create combos" });
  }

  try {
    const combo = await Combo.create({
      comboName,
      price,
      description,
      city,
      category,
      sellerId: req.user.id
    });

    res.status(201).json({ message: "Combo created successfully", combo });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Combos by City
router.get("/city/:city", async (req, res) => {
  try {
    const combos = await Combo.find({ city: req.params.city }).populate("sellerId", "name email");
    res.status(200).json(combos);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
