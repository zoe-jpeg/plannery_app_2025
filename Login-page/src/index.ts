import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./auth";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Authentication routes
app.use("/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("✅ Welcome to the Login System API!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
