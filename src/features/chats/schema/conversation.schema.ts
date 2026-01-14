import z from "zod";

export const createConversationSchema = z.object({
  participantsIds: z.array(z.uuid()), 
  groupName: z.string().optional().nullable(),
}).strict();