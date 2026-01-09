import { ConversationType } from '../../../../generated/prisma/client.js';
import { BadRequestException, ConflictException, UnAuthorizedException } from '../../../global/core/error.core.js';
import { prisma } from '../../../prisma.js';
import { CreateConversationDTO } from '../interfaces/conversation.interface.js';
import { ConversationResponse } from '../types/conversation.type.js';

class ConversationService {
    public async getConversations(currentUser: UserPayload): Promise<ConversationResponse[]> {
        // Load all conversations
        // We don't call the isConversationParticipant here because
        // We get the conversations of the current user  by field participants
        const conversations = await prisma.conversation.findMany({
            where: {
                participants: {
                    some: { id: currentUser.id },
                },
            },
            select: {
                id: true,
                type: true,
                name: true,
                lastMessageContent: true,
                lastMessageAt: true,
                participants: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });

        return conversations;
    }

    public async getConversation(currentUser: UserPayload, conversationId: string): Promise<ConversationResponse | null> {
        // Current user doesn't belong to conversation
        const authorized = await this.isConversationParticipant(currentUser.id, conversationId);
        if (!authorized) {
            throw new UnAuthorizedException('You are not authorized to fetch this conversation');
        }

        // Return the conversation
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            select: {
                id: true,
                type: true,
                name: true,
                lastMessageContent: true,
                lastMessageAt: true,
                // Εδώ βάζεις τα participants με το δικό τους select
                participants: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });

        return conversation;
    }

    public async createConversation(reqBody: CreateConversationDTO, currentUser: UserPayload): Promise<ConversationResponse> {
        const { participantsIds, groupName } = reqBody;

        // All participants ids including the user that made the request
        const participantSetIds = Array.from(new Set([currentUser.id, ...participantsIds]));

        if (participantSetIds.length < 2) {
            throw new BadRequestException('At least 2 participants required');
        }

        // Conversation type based on participants
        const type = participantSetIds.length === 2 ? ConversationType.PRIVATE : ConversationType.GROUP;

        if (type === ConversationType.GROUP && groupName == null) {
            throw new BadRequestException('Group name not provided');
        }

        // We can have many group chats with the same participants
        // But only one private chat with the 2 same participants
        if (type === ConversationType.PRIVATE) {
            const targetUserId = participantsIds[0];

            //We only need to return the id 
            const existing = await prisma.conversation.findFirst({
                where: {
                    type: ConversationType.PRIVATE,
                    AND: [{ participants: { some: { id: currentUser.id } } }, { participants: { some: { id: targetUserId } } }],
                },
                select: { id: true }, 
            });

            // Private chat already exists, we return the id so the frontend can render the conversation
            if (existing) {
                throw new ConflictException('Conversation already exists', {
                    id: existing.id,
                });
            }
        }

        // We create the new conversation
        const conversation = await prisma.conversation.create({
            data: {
                type,
                name: groupName,
                participants: {
                    connect: participantSetIds.map((id) => ({ id })),
                },
            },
            select: {
                id: true,
                type: true,
                name: true,
                lastMessageContent: true,
                lastMessageAt: true,
                participants: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });

        return conversation;
    }

    public async isConversationParticipant(userId: string, conversationId: string): Promise<boolean> {
        // We check if the current user belongs to the conversation by the id
        const conversation = await prisma.conversation.findFirst({
            where: {
                id: conversationId,
                participants: {
                    some: { id: userId },
                },
            },
            select: { id: true }
        });
        return !!conversation;
    }
}

export const conversationService: ConversationService = new ConversationService();
