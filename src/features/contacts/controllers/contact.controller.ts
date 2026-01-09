import { type Request, type Response } from 'express';
import { contactService } from '../services/contact.service.js';
import { StatusCodes } from 'http-status-codes';

class ContactController {
    public async createContact(req: Request, res: Response) {
        const currentUser = req.currentUser as UserPayload;

        const contact = await contactService.createContact(req.body, currentUser);

        return res.status(StatusCodes.CREATED).json({
            message: 'Buddy added successfully',
            data: contact,
        });
    }

    public async getContacts(req: Request, res: Response) {
        const currentUser = req.currentUser as UserPayload;

        const contacts = await contactService.getContacts(currentUser);

        return res.status(StatusCodes.OK).json({
            message: 'Got all buddies successfully',
            data: contacts,
        });
    }
}

export const contactController: ContactController = new ContactController();
