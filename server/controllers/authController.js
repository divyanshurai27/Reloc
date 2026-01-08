import User from "../models/User.js";
import jwt from "jsonwebtoken";
console.log("AUTH CONTROLLER REFRESHED");

export const signup = async (req, res) => {
  const { name, email, password, city, role } = req.body;

  try {
    await User.create({ name, email, password, city, role });
    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(400).json({ error: "User exists or invalid data" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ error: "User not found" });
  if (user.password !== password) return res.status(401).json({ error: "Wrong password" });

  const token = jwt.sign(
    { id: user._id, role: user.role, city: user.city },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(200).json({ message: "Login successful", token });
};
