import { type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { postService } from '../services/post.service.js';
import { GetPostsQuerySchema } from '../schemas/post.schemas.js';

class PostController {
    public async createPost(req: Request, res: Response) {
        const currentUser = req.currentUser as UserPayload;

        const post = await postService.createPost(req.body, currentUser);

        return res.status(StatusCodes.CREATED).json({
            message: 'Post created successfully',
            data: post,
        });
    }

    public async getPosts(req: Request, res: Response) {
        const parsedQuery = GetPostsQuerySchema.safeParse(req.query);

        if (parsedQuery.success) {
            const posts = await postService.getPostsByCategory(parsedQuery.data.category);

            return res.status(StatusCodes.OK).json({
                message: 'Posts filtered by category fetched successfully',
                data: posts,
            });
        }

        const posts = await postService.getPosts();
        return res.status(StatusCodes.OK).json({
            message: 'Posts fetched successfully',
            data: posts,
        });
    }
}

export const postController: PostController = new PostController();
