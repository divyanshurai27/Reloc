import express from "express";
import jwt from "jsonwebtoken";
import Combo from "../models/Combo.js";

const router = express.Router();

// Protect middleware
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

// CREATE COMBO
router.post("/", protect, async (req, res) => {
  const { title, price, description, city, items } = req.body;

  if (req.user.role !== "seller" && req.user.role !== "admin") {
    return res.status(401).json({ error: "Only seller or admin can create combos" });
  }

  if (!title || !price || !city) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const combo = await Combo.create({
      title,
      price,
      description,
      city,
      items,
      seller: req.user.id
    });

    res.status(201).json(combo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET ALL COMBOS (OPTIONAL CITY FILTER)
router.get("/", async (req, res) => {
  const filter = {};
  if (req.query.city) filter.city = req.query.city;

  try {
    const combos = await Combo.find(filter).populate("seller", "name email");
    res.json(combos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET SINGLE COMBO
router.get("/:id", async (req, res) => {
  try {
    const combo = await Combo.findById(req.params.id).populate("seller", "name email");
    if (!combo) return res.status(404).json({ error: "Combo not found" });
    res.json(combo);
  } catch (err) {
    res.status(400).json({ error: "Invalid combo ID" });
  }
});

export default router;
