import { PostCategory } from "../../../../generated/prisma/enums.js";

export interface CreatePostDTO {
    title: string;
    content: string;
    category: PostCategory;
}