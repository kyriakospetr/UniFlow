import { type Request, type Response } from 'express';
import { messageService } from '../services/message.service.js';
import { StatusCodes } from 'http-status-codes';
import { getIO } from '../../../global/config/socket.config.js';
class MessageController {
    public async getAll(req: Request, res: Response) {
        const currentUser = req.currentUser as UserPayload;
        const conversationId = req.params.id;

        const messages = await messageService.getAll(currentUser, conversationId);

        return res.status(StatusCodes.OK).json({
            message: 'Messages fetched successfully',
            data: messages,
        });
    }

    public async send(req: Request, res: Response) {
        const currentUser = req.currentUser as UserPayload;
        const conversationId = req.params.id;

        const { message, conversation } = await messageService.send(req.body, currentUser, conversationId);

        // Live: We update the inbox, conversation of every participant
        const io = getIO();
        conversation?.participants.forEach((participant) => {
            io.to(`user_${participant.id}`).emit('new_message', {
                conversation,
                message,
            });
        });

        return res.status(StatusCodes.CREATED).json({
            message: 'Message sent successfully',
            data: message,
        });
    }
}

export const messageController: MessageController = new MessageController();
