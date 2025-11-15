import { AuthRequest, Request, Response, NextFunction } from "./types.ts";
import * as jwt from "jsonwebtoken";
import { SECRET_KEY } from "./config.ts";

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    // Check if the user is attempting to access sensitive routes without a token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401); // Unauthorized
    }

    // Verify the token
    // FIX 2 & 3: Add explicit types for error (jwt.VerifyErrors) and user (object | string)
    jwt.verify(token, SECRET_KEY, (err: jwt.VerifyErrors | null, user: any) => {
        if (err) {
            return res.sendStatus(403); // Forbidden (Token is invalid or expired)
        }
        
        // Attach user info to the request object. We use 'any' here since the structure of 
        // the user payload is defined in auth.ts (username: string)
        req.user = user;
        next(); // Proceed to the protected route handler
    });
};