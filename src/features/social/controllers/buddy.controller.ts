import { type Request, type Response } from "express";
import { buddyService } from "../services/buddy.service.js";
import { StatusCodes } from "http-status-codes";

class BuddyController {
    public async findBuddy(req: Request, res: Response) {
        const currentUser = req.currentUser as UserPayload

        const contact = await buddyService.findBuddy(req.body, currentUser);

        return res.status(StatusCodes.CREATED).json({
            message: "Buddy added successfully",
            data: contact
        })
    }

    public async listAllBuddies(req: Request, res: Response) {
        const currentUser = req.currentUser as UserPayload;

        const contacts = await buddyService.listAllBuddies(currentUser);

        return res.status(StatusCodes.OK).json({
            message: "Got all buddies successfully",
            data: contacts
        });
    }
}

export const buddyController: BuddyController = new BuddyController();
