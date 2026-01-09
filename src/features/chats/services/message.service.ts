import { UnAuthorizedException } from '../../../global/core/error.core.js';
import { prisma } from '../../../prisma.js';
import { SendMessageDTO } from '../interfaces/message.interface.js';
import { MessageResponse, SendMessageResponse } from '../types/message.type.js';
import { conversationService } from './conversation.service.js';

class MessageService {
    public async getMessages(currentUser: UserPayload, conversationId: string): Promise<MessageResponse[]> {

        // Current user doesn't belong to conversation
        const authorized = await conversationService.isConversationParticipant(currentUser.id, conversationId);
        if (!authorized) {
            throw new UnAuthorizedException('You are not authorized to get messages from this conversation');
        }

        // Load all conversation messages
        const messages = await prisma.message.findMany({
            where: {
                conversationId: conversationId,
            },
            orderBy: {
                createdAt: 'asc',
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });

        return messages;
    }

    public async sendMessage(currentUser: UserPayload, conversationId: string ,reqBody: SendMessageDTO): Promise<SendMessageResponse> {
        const { content } = reqBody;

        // Current user doesn't belong to conversation
        const authorized = await conversationService.isConversationParticipant(currentUser.id, conversationId);
        if (!authorized) {
            throw new UnAuthorizedException('You are not authorized');
        }

        // We create the new message and update the conversation 
        return await prisma.$transaction(async (tx) => {
            const message = await tx.message.create({
                data: {
                    content,
                    senderId: currentUser.id,
                    conversationId,
                },
                include: {
                    sender: { select: { id: true, username: true } },
                },
            });

            const conversation = await tx.conversation.update({
                where: { id: conversationId },
                data: {
                    lastMessageContent: content,
                    lastMessageAt: new Date(),
                    updatedAt: new Date(), 
                },
                include: {
                    participants: { select: { id: true, username: true } },
                },
            });

            // We return both for the socket 
            return { message, conversation };
        });
    }
}

export const messageService: MessageService = new MessageService();
