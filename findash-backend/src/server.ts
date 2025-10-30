import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// Décommente si tu veux le rate limiter
// import { rateLimiter } from "./middleware/rateLimiter";
import authRoutes from "./routes/auth";
import portfolioRoutes from "./routes/portfolio";
// @ts-ignore
import holdingsRoutes from "./routes/holdings";
// import alertRoutes from "./routes/alerts";  ← COMMENTE CETTE LIGNE



// 📍 IMPORTE LE JOB D'ALERTES
// import "./jobs/alertChecker";



dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());
// Décommente si tu veux le rate limiter
// app.use(rateLimiter);


// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Backend running", port: PORT });
});


// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/holdings", holdingsRoutes);
// app.use("/api/alerts", alertRoutes);  ← COMMENTE CELLE-CI AUSSI



app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
