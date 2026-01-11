import { Prisma } from "../../../../generated/prisma/client.js";

// Ορίζουμε τον τύπο που αντιστοιχεί στο include/select που κάνεις
export type ConversationWithParticipantsInfo = Prisma.ConversationGetPayload<{
    include: {
        participants: { select: { id: true; username: true } };
    };
}>;