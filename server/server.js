require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const seedAdmin = require("./config/seedAdmin");

// Import route modules
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const savedJobRoutes = require("./routes/savedJobRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Trust proxy (important for Render / reverse proxies)
app.set("trust proxy", 1);

// ─────────────────────────────────────────────
// Database
// ─────────────────────────────────────────────
connectDB().then(() => seedAdmin());

// ─────────────────────────────────────────────
// Security Middleware
// ─────────────────────────────────────────────

// Helmet configuration (avoid CSP blocking resources)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS configuration (allow Vercel frontend + local dev)
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

// ─────────────────────────────────────────────
// Rate Limiting
// ─────────────────────────────────────────────

// General limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

// Apply general limiter only in production
if (process.env.NODE_ENV === "production") {
  app.use(generalLimiter);
}

// Stricter limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts, please try again later." },
});

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/admin", adminRoutes);

// ─────────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────────

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────
// Global Error Handler
// ─────────────────────────────────────────────

app.use((err, req, res, next) => {
  if (
    err.message === "Only PDF files are allowed" ||
    err.message === "Only PNG, JPG, JPEG, and WEBP images are allowed"
  ) {
    return res.status(400).json({ message: err.message });
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    return res
      .status(400)
      .json({ message: "File size exceeds the allowed limit" });
  }

  console.error("Unhandled error:", err);

  res.status(500).json({
    message: "Internal server error",
  });
});

// ─────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});