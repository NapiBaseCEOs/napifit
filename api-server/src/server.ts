import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";

// Load environment variables
// Try to load from parent directory first (main project .env)
dotenv.config({ path: '../.env' });
// Then try local .env (if exists)
dotenv.config({ override: false });

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
import authRoutes from "./routes/auth";
import profileRoutes from "./routes/profile";
import mealsRoutes from "./routes/meals";
import workoutsRoutes from "./routes/workouts";
import waterIntakeRoutes from "./routes/water-intake";
import healthMetricsRoutes from "./routes/health-metrics";
import featureRequestsRoutes from "./routes/feature-requests";
import featureRequestsLikeRoutes from "./routes/feature-requests-like";
import featureRequestsLeaderboardRoutes from "./routes/feature-requests-leaderboard";

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/meals", mealsRoutes);
app.use("/api/workouts", workoutsRoutes);
app.use("/api/water-intake", waterIntakeRoutes);
app.use("/api/health-metrics", healthMetricsRoutes);
app.use("/api/feature-requests", featureRequestsRoutes);
app.use("/api/feature-requests", featureRequestsLikeRoutes);
app.use("/api/feature-requests/leaderboard", featureRequestsLeaderboardRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Export for Vercel serverless
export default app;

// Only listen if not in Vercel environment
if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`🚀 NapiFit API Server running on port ${PORT}`);
    console.log(`📡 CORS enabled for: ${CORS_ORIGIN}`);
  });
}

