import * as Express from 'express';
export type Request = Express.Request;
export type Response = Express.Response;
export type NextFunction = Express.NextFunction;
// Define the payload structure used in JWT
export interface JwtPayload {
    username: string;
}

// Extend the Request object to include the user property added by the middleware
export interface AuthRequest extends Request {
    user?: JwtPayload;
    body: {
        newPassword?: string; // Add specific body properties for strong typing
        username?: string;
        password?: string;
        // ... any other common body props
    }
}