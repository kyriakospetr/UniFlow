import z from "zod";

export const FindBuddySchema = z.object({
    username: z.string().min(3).max(60).trim()
}).strict();