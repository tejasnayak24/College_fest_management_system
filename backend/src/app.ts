import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import eventRoutes from "./modules/events/event.routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("FestSphere API is running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

export default app;