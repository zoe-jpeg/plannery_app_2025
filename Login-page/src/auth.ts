import express, { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { createUser, findUser, validatePassword } from "./users";

const router = express.Router();
const SECRET_KEY = "mysecretkey"; // ⚠️ Replace with process.env.SECRET_KEY in production

// ✅ Register endpoint
router.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const existing = await findUser(username);
  if (existing) {
    return res.status(400).json({ message: "User already exists." });
  }

  const newUser = await createUser(username, password);
  res.status(201).json({ message: "User created successfully", user: newUser.username });
});

// ✅ Login endpoint
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await findUser(username);
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isValid = await validatePassword(user, password);
  if (!isValid) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ message: "Login successful", token });
});

export default router;
