import { z } from 'zod';

export const localSignUpSchema = z.object({
    email: z.email().max(64),
    username: z.string().min(3).max(50).trim(),
    password: z.string().min(6).max(64).trim()
}).strict();

export const socialSignUpSchema = z.object({
  googleId: z.string().optional(),
  facebookId: z.string().optional(),
  email: z.email().max(64).optional(),
  username: z.string().min(3).max(50).trim().optional()
}).strict();