import z from "zod";

export const FindContactSchema = z.object({
    username: z.string().min(3).max(60).trim()
}).strict();
