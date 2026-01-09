import z from "zod";

export const createConversationSchema = z.object({
  participantsIds: z.array(z.string().uuid()), // array από valid UUIDs
  groupName: z.string().optional().nullable(),
});