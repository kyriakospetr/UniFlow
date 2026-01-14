import { type Request, type Response } from 'express';
import { contactService } from '../services/contact.service.js';
import { StatusCodes } from 'http-status-codes';

class ContactController {
    public async create(req: Request, res: Response) {
        const currentUser = req.currentUser as UserPayload;

        const contact = await contactService.create(req.body, currentUser);

        return res.status(StatusCodes.CREATED).json({
            message: 'Contacts added successfully',
            data: contact,
        });
    }

    public async getAll(req: Request, res: Response) {
        const currentUser = req.currentUser as UserPayload;

        const contacts = await contactService.getAll(currentUser);

        return res.status(StatusCodes.OK).json({
            message: 'Contacts fetched successfully',
            data: contacts,
        });
    }
}

export const contactController: ContactController = new ContactController();
