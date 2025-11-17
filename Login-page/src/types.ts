import * as Express from 'express';
export type Request = Express.Request;
export type Response = Express.Response;
export type NextFunction = Express.NextFunction;
// Defines the payload structure used in JWT
export interface JwtPayload {
    username: string;
}

// Extends the Request object to include the user property added by the middleware
export interface AuthRequest extends Request {
    user?: JwtPayload;
    body: {
        newPassword?: string; // Adds specific body properties for strong typing
        username?: string;
        password?: string;
        
    }
}