import { type Request, type Response, type NextFunction } from 'express';
import { BadRequestException } from '../cores/error.core.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export async function verifyUser(req: Request, res: Response, next: NextFunction) {
    try {
        // Check if token exists
        if (!req.cookies?.accessToken) {
            throw new BadRequestException('Please provide token');
        }

        const token = req.cookies.accessToken;

        // Decode and verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;

        if (!decoded) {
            throw new BadRequestException('Invalid token');
        }

        // Extract properties
        const { id, username, email } = decoded;

        // Attach to request object
        req.currentUser = { id, username, email };

        next();
    } catch (err) {
        // JWT errors: TokenExpiredError, JsonWebTokenError, etc.
        throw new BadRequestException('Invalid or expired token');
    }
}
