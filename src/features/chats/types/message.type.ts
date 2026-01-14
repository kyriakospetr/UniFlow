import { Prisma } from "../../../../generated/prisma/client.js";
import { ConversationResponse } from "./conversation.type.js";

export type MessageResponse = Prisma.MessageGetPayload<{
    include: {
        sender: {
            select: {
                id: true;
                username: true;
            };
        };
    };
}>;

export type SendMessageResponse = {
    message: MessageResponse
    conversation: ConversationResponse;
};