import { type Request ,type Response } from "express";
import { StatusCodes } from "http-status-codes";

class UserController {
    public async getCurrentUser(req: Request, res: Response) {
        const currentUser = req.currentUser as UserPayload;

        return res.status(StatusCodes.OK).json({
            data: currentUser
        });
    }
}

export const userController: UserController = new UserController();