import path from "path";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import dataRoutes from "./routes/data.route.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import morgan from "morgan";

dotenv.config();
connectDB();

const app = express();
const __dirname = path.resolve();

// Body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan("dev"));

// CORS
app.use(cors());

// API routes
app.use("/api/auth", userRoutes);
app.use("/api/data", dataRoutes);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
}

// Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`
      .yellow.bold
  );
});
