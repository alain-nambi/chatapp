// Load environment variables
import dotenv from "dotenv"
dotenv.config()



// Import core dependencies
import express from "express"
import cors from "cors"

// Import route modules
import { authRouter } from "./routes/auth_routes.js"

// Initialize the app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
  });
});

// Environment config endpoint (optional - remove in production)
app.get('/config', (_req, res) => {
  res.status(200).json({
    port: process.env.PORT || 3000,
  });
});

// Root route
app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Welcome to the backend server!',
  });
});

// Register API routes
app.use('/api/auth', authRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
