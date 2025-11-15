import express from "express"; // <-- Use default import only
import * as jwt from "jsonwebtoken";
import { createUser, findUser, validatePassword, updateUserPassword } from "./users.ts";
import { authenticateToken } from "./middleware.ts";
// Import base types (Request, Response) and custom type (AuthRequest) from your local file
import { AuthRequest, Request, Response } from "./types.ts"; 
import { SECRET_KEY } from "./config.ts"; 

const router = express.Router();

// --- REGISTER ---
router.post("/register", async (req: Request, res: Response) => {
  console.log("POST /auth/register called");
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required." });
  }

  const existingUser = await findUser(username);
  if (existingUser) {
    return res.status(409).json({ message: "User already exists." });
  }

  const newUser = await createUser(username, password);

  // Use the imported SECRET_KEY from ./config
  const token = jwt.sign({ username: newUser.username }, SECRET_KEY, { expiresIn: "1h" });

  return res.json({ message: "User created successfully.", token });
});

// --- LOGIN ---
router.post("/login", async (req: Request, res: Response) => {
  console.log("POST /auth/login called");
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required." });
  }

  const user = await findUser(username);
  if (!user) return res.status(404).json({ message: "User not found." });

  const isValid = await validatePassword(user, password);
  if (!isValid) return res.status(401).json({ message: "Incorrect password." });

  // Use the imported SECRET_KEY from ./config
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  return res.json({ message: "Login successful.", token });
});

// --- CHANGE PASSWORD (protected) ---
router.post("/change-password", authenticateToken, async (req: AuthRequest, res: Response) => {
  console.log("POST /auth/change-password called");
  const { newPassword } = req.body;
  const username = req.user!.username;

  if (!newPassword) return res.status(400).json({ message: "New password required." });

  const success = await updateUserPassword(username, newPassword);
  if (!success) return res.status(404).json({ message: "User not found." });

  res.json({ message: "Password updated successfully." });
});

export default router;