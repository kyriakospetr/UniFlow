import { type Request, type Response } from "express";
import { authService } from "../services/auth.service.js";
import { sendTokenToCookie } from "../../../global/helpers/cookie.helper.js";
import { StatusCodes } from "http-status-codes";

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

    public async logout(req: Request, res: Response) {
        res.clearCookie('accessToken');

        return res.status(StatusCodes.OK).json({
            message: "User logged out successfully"
        });
    }
}

export const authController: AuthController = new AuthController();