import { type Request, type Response, type NextFunction } from 'express';
import { UnAuthorizedException } from '../core/error.core.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Verify user middleware
export async function verifyUser(req: Request, res: Response, next: NextFunction) {
    try {
        // Check if token exists
        if (!req.cookies?.accessToken) {
            throw new UnAuthorizedException('Please provide token');
        }

        const token = req.cookies.accessToken;

        // Decode and verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;

        if (!decoded) {
            throw new UnAuthorizedException('Invalid token');
        }

        // Extract properties
        const { id, username, email } = decoded;

        // Attach to request object
        req.currentUser = { id, username, email };

        next();
    } catch (err) {
        // JWT errors: TokenExpiredError, JsonWebTokenError, etc.
        throw new UnAuthorizedException('Invalid or expired token');
    }
}
