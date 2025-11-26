"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("./middleware/errorHandler");
// Load environment variables
// Try to load from parent directory first (main project .env)
dotenv_1.default.config({ path: '../.env' });
// Then try local .env (if exists)
dotenv_1.default.config({ override: false });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
// Middleware
app.use((0, cors_1.default)({
    origin: CORS_ORIGIN,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
// API Routes
const auth_1 = __importDefault(require("./routes/auth"));
const profile_1 = __importDefault(require("./routes/profile"));
const meals_1 = __importDefault(require("./routes/meals"));
const workouts_1 = __importDefault(require("./routes/workouts"));
const water_intake_1 = __importDefault(require("./routes/water-intake"));
const health_metrics_1 = __importDefault(require("./routes/health-metrics"));
const feature_requests_1 = __importDefault(require("./routes/feature-requests"));
const feature_requests_like_1 = __importDefault(require("./routes/feature-requests-like"));
const feature_requests_leaderboard_1 = __importDefault(require("./routes/feature-requests-leaderboard"));
app.use("/api/auth", auth_1.default);
app.use("/api/profile", profile_1.default);
app.use("/api/meals", meals_1.default);
app.use("/api/workouts", workouts_1.default);
app.use("/api/water-intake", water_intake_1.default);
app.use("/api/health-metrics", health_metrics_1.default);
app.use("/api/feature-requests", feature_requests_1.default);
app.use("/api/feature-requests", feature_requests_like_1.default);
app.use("/api/feature-requests/leaderboard", feature_requests_leaderboard_1.default);
// Error handler (must be last)
app.use(errorHandler_1.errorHandler);
// Export for Vercel serverless
exports.default = app;
// Only listen if not in Vercel environment
if (process.env.VERCEL !== "1") {
    app.listen(PORT, () => {
        console.log(`🚀 NapiFit API Server running on port ${PORT}`);
        console.log(`📡 CORS enabled for: ${CORS_ORIGIN}`);
    });
}
//# sourceMappingURL=server.js.map