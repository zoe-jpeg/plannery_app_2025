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

    
    jwt.verify(token, SECRET_KEY, (err: jwt.VerifyErrors | null, user: any) => {
        if (err) {
            return res.sendStatus(403); // Forbidden (Token is invalid or expired)
        }
        
        
        req.user = user;
        next(); // Proceeds to the protected route handler
    });
};