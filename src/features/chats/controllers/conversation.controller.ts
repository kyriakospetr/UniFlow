import { type Request, type Response } from 'express';
import { conversationService } from '../services/conversation.service.js';
import { StatusCodes } from 'http-status-codes';

class ConversationController {
    public async getAll(req: Request, res: Response) {
        const currentUser = req.currentUser as UserPayload;

        const conversations = await conversationService.getAll(currentUser);

        return res.status(StatusCodes.OK).json({
            message: 'Conversations fetched successfully',
            data: conversations,
        });
    }

    public async get(req: Request, res: Response) {
        const conversationId = req.params.conversationId;
        const currentUser = req.currentUser as UserPayload;

        const conversation = await conversationService.get(currentUser, conversationId);

        return res.status(StatusCodes.OK).json({
            message: 'Conversation fetched successfully',
            data: conversation,
        });
    }

    public async create(req: Request, res: Response) {
        const currentUser = req.currentUser as UserPayload;

        const conversation = await conversationService.create(req.body, currentUser);

        return res.status(StatusCodes.CREATED).json({
            message: 'Conversation created successfully',
            data: conversation,
        });
    }
}

export const conversationController: ConversationController = new ConversationController();
