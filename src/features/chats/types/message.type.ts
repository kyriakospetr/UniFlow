import { Prisma } from "../../../../generated/prisma/client.js";
import { ConversationWithParticipantsInfo } from "./conversation.type.js";

export type MessageWithSenderInfo = Prisma.MessageGetPayload<{
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
    message: MessageWithSenderInfo;
    conversation: ConversationWithParticipantsInfo;
};