import { PostCategory } from '../../../../generated/prisma/enums.js';
import { prisma } from '../../../prisma.js';
import { CreatePostDTO } from '../interfaces/post.interface.js';
import { PostResponse } from '../types/post.type.js';

class PostService {
    public async create(reqBody: CreatePostDTO, currentUser: UserPayload): Promise<PostResponse> {
        const { title, content, category } = reqBody;

        // We include the author details so we can show them on feed
        const post = await prisma.post.create({
            data: {
                title,
                content,
                category,
                authorId: currentUser.id,
            },
            include: {
                author: {
                    select: {
                        username: true,
                    },
                },
            },
        });
        return post;
    }

    public async getAll(): Promise<PostResponse[]> {
        return await prisma.post.findMany({
            orderBy: { 
                createdAt: 'desc' 
            },
            include: {
                author: { 
                    select: { 
                        username: true 
                    } 
                },
            },
        });
    }

    public async getByCategory(category: PostCategory): Promise<PostResponse[]> {
        return await prisma.post.findMany({
            where: { 
                category 
            },
            orderBy: { 
                createdAt: 'desc' 
            },
            include: {
                author: { 
                    select: { 
                        username: true 
                    } 
                },
            },
        });
    }
}

export const postService: PostService = new PostService();
