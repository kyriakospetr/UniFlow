import { type NextFunction, type Request, type Response } from "express";
import { authService } from "../services/auth.service.ts";
import { sendTokenToCookie } from "../../../global/helpers/cookie.helper.ts";
import { StatusCodes } from "http-status-codes";
import passport from "passport";

class AuthController {

    public async signUp(req: Request, res: Response) {
        const accessToken = await authService.signUp(req.body);

        sendTokenToCookie(res, accessToken);

        return res.status(StatusCodes.CREATED).json({
            message: "User created successfully",
            data: accessToken
        });
    }

    public async login(req: Request, res: Response) {
        const accessToken = await authService.login(req.body);

        sendTokenToCookie(res, accessToken);

        return res.status(StatusCodes.OK).json({
            message: "User logged in successfully",
            data: accessToken
        });
    }
    
    public googleLogin(req: Request, res: Response, next: NextFunction) {
        passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
    }

    public googleCallback(req: Request, res: Response, next: NextFunction) {
        passport.authenticate('google', { session: false }, async (err: any, accessToken: string) => {
            if (err || !accessToken) {
                return res.redirect('http://localhost:3000/login?error=auth_failed');
            }

            sendTokenToCookie(res, accessToken);
            
            return res.redirect('http://localhost:3000/dashboard');
        })(req, res, next);
    }

    public async logout(req: Request, res: Response) {
        res.clearCookie('accessToken');

        return res.status(StatusCodes.OK).json({
            message: "User logged out successfully"
        });
    }
}

export const authController: AuthController = new AuthController();