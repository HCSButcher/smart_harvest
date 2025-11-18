const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const pino = require("pino");
const { clerkMiddleware } = require("@clerk/express");
const syncUser = require("./middleware/syncUser");

// Imports
const aiRoutes = require("./routes/ai.js");
const produceRoutes = require("./routes/produce.js");
const paymentRoutes = require("./routes/payments.js");
const clerkRoutes = require("./routes/clerk.js");
const webhookRoutes = require("./routes/weebhook.js");
const adminRoutes = require("./routes/adminRoutes.js");
const purchaseRoutes = require("./routes/purchase.js");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware.js");

const app = express();

// Logger
const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    process.env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        }
      : undefined,
});

// 1️⃣ BASE MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.enable("trust proxy");

// 2️⃣ CORS FIRST
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://smart-harvest-9d4p.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Clerk-Auth"],
  })
);

// FIX → Express 5 requires REGEX for wildcard routes
app.options(/.*/, cors());

// 3️⃣ CLERK (AFTER CORS)
app.use(clerkMiddleware());

// 4️⃣ SYNC USER (AFTER Clerk)
app.use(syncUser);

// 5️⃣ ROUTES
app.use("/api/ai", aiRoutes);
app.use("/api/produce", produceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/clerk", clerkRoutes);
app.use("/api/purchase", purchaseRoutes);

app.use("/api/webhook", webhookRoutes);
app.use("/api/admin", adminRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("🚀 API server for Smart Harvest backend is running...");
});

// 6️⃣ START SERVER + CONNECT DB
const PORT = process.env.PORT || 5000;

connectDB();

// Error handler last
app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
