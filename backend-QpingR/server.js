import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import partnerRoutes from "./routes/partnerRoutes.js";
import siteContentRoutes from "./routes/siteContentRoutes.js"; // Add this
import authRoutes from "./routes/authRoutes.js"; // Add this

const app = express();
const port = 5001;

app.use(
  cors({
    origin: "http://localhost:5173", // Allow only your frontend
    credentials: true, // Allow cookies, authorization headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);
// Middleware
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the vybes API");
});

// Routes
app.use("/api/partners", partnerRoutes);
app.use("/api/site-content", siteContentRoutes); // Add this
app.use("/api/auth", authRoutes); // Add this

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () =>
      console.log(`Server started on http://localhost:${port}`)
    );
  } catch (error) {
    console.error("Server failed to start:", error);
  }
};

startServer();
