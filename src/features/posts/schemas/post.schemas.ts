import { z } from 'zod';
import { PostCategory } from '../../../../generated/prisma/enums.js';

// Enum for zod
const PostCategoryEnum = z.enum(PostCategory);

export const CreatePostSchema = z.object({
    title: z.string().min(3).max(30),
    content: z.string().min(5).max(2000),
    category: PostCategoryEnum 
}).strict();

export const GetPostsQuerySchema = z.object({
    category: PostCategoryEnum 
});