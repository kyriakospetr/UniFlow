import { z } from 'zod';

export const SignUpSchema = z.object({
    email: z.email().max(64),
    username: z.string().min(3).max(60).trim(),
    password: z.string().min(6).max(64).trim()
}).strict();

export const LoginSchema = z.object({
    email: z.email().max(64),
    password: z.string().min(6).max(64).trim()
}).strict();
