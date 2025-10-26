import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { rateLimiter } from "./middleware/rateLimiter";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Backend running", port: PORT });
});

// Routes (à ajouter)
// app.use("/api/auth", authRoutes);
// app.use("/api/portfolio", portfolioRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
