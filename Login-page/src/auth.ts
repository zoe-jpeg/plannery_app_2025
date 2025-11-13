// auth.ts

import express, { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { createUser, findUser, validatePassword, updateUserPassword } from "./users"; // ⚠️ Import updateUserPassword
import { authenticateToken } from "./middleware"; // ⚠️ Import middleware

const router = express.Router();
const SECRET_KEY = "mysecretkey"; // ⚠️ Replace with process.env.SECRET_KEY in production

// ... (Existing /register and /login endpoints)

// ✅ Reset/Change Password endpoint (Requires authentication)
router.post("/change-password", authenticateToken, async (req: Request, res: Response) => {
    // Note: The username is available in req.user from the middleware
    const { newPassword } = req.body;
    const username = (req as any).user.username; // Get username from the token payload

    if (!newPassword) {
        return res.status(400).json({ message: "New password is required." });
    }

    try {
        await updateUserPassword(username, newPassword);
        res.json({ message: "Password updated successfully." });
    } catch (error) {
        // Handle case where user might not be found (though middleware ensures they exist)
        res.status(500).json({ message: "Could not update password." });
    }
});

export default router;