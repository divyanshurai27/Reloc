import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authroutes.js";
import comboRoutes from "./routes/comboRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";



dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/combos",comboRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/auth", authRoutes);


app.listen(5000, () => console.log("Backend running on port 5000"));
