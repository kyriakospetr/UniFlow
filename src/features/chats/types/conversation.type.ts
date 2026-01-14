import { Prisma } from "../../../../generated/prisma/client.js";

export type ConversationResponse= Prisma.ConversationGetPayload<{
    include: {
        participants: { select: { id: true; username: true } };
    };
}>;