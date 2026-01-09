import { type Response } from "express";

export function sendTokenToCookie(res: Response, accessToken: string) {
    res.cookie('accessToken', accessToken, {
        maxAge: 1000 * 60 * 60,
        httpOnly: true, 
        secure: false, 
        sameSite: 'lax' // Lax is used in order the socket io middleware to read the cookie
    });
}
