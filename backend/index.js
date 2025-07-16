// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Import core dependencies
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import route modules
import authRouter from "./routes/auth_routes.js";
import messageRouter from "./routes/message_routes.js";

import { authenticate } from "./middlewares/authenticate.js";

// Initialize the app
const app = express();

// Middleware
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "UP",
    timestamp: new Date().toISOString(),
  });
});

// Environment config endpoint (optional - remove in production)
app.get("/api/config", authenticate, (_req, res) => {
  res.status(200).json({
    port: process.env.PORT || 3000,
  });
});

// Root route
app.get("/api/", (_req, res) => {
  res.status(200).json({
    message: "Welcome to the backend server!",
  });
});

// Register API routes
app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
