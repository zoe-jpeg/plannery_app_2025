// middleware.ts

import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

const SECRET_KEY = "mysecretkey"; // Must match the key in auth.ts

// Extend the Request object for TypeScript to recognize the added 'user' property
interface AuthRequest extends Request {
    user?: { username: string };
}

// ✅ Export the middleware function
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    // Format: Bearer TOKEN
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401); // Unauthorized (No token provided)
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden (Token invalid or expired)
        }
        // Attach the user payload to the request
        req.user = user as { username: string };
        next();
    });
};