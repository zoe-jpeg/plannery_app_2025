import express from "express"; 
import * as authModule from "./auth.ts";

// 1. Initialize Express App
const app = express();
const PORT = 3001; 

// 2. Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Mount Router
app.use("/api/auth", authModule.default); 

// 4. Test route
app.get("/", (req, res) => {
  console.log("GET / called");
  res.send("✅ Welcome to the Login System API!");
});

// 5. Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log("API Endpoints:");
  console.log(`- POST /api/auth/register`);
  console.log(`- POST /api/auth/login`);
});