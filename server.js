const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const pino = require("pino");

//imports
const aiRoutes = require("./routes/ai.js");
const produceRoutes = require("./routes/produce.js");
const paymentRoutes = require("./routes/payments.js");
const clerkRoutes = require("./routes/clerk.js");
const webhookRoutes = require("./routes/weebhook.js");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware.js");

const app = express();

// Enable live logging
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

//middleware
app.use(express.json());
app.enable("trust proxy");
app.use(express.urlencoded({ extended: false }));

//cors setup
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//API routes
app.use("/api/ai", aiRoutes);
app.use("/api/produce", produceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/clerk", clerkRoutes);
app.use("/api/webhook", webhookRoutes);

//default route
app.get("/", (req, res) => {
  res.send("🚀 API server for Express.js is up and running...");
});

const PORT = process.env.PORT || 5000;

connectDB();

//error middleware
app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
