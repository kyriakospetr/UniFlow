import { PostCategory } from '../../../../generated/prisma/enums.js';
import { prisma } from '../../../prisma.js';
import { CreatePostDTO } from '../interfaces/post.interface.js';

class PostService {
    public async createPost(reqBody: CreatePostDTO, currentUser: UserPayload) {
        const { title, content, category } = reqBody;

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

    public async getPosts() {
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

    public async getPostsByCategory(category: PostCategory) {
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
