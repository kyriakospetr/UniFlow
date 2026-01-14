import { Router } from 'express';
import { verifyUser } from '../../../global/middlewares/verify.user.middleware.js';
import asyncWrapper from '../../../global/core/async.wrapper.core.js';
import { postController } from '../controllers/post.controller.js';
import { validateSchema } from '../../../global/middlewares/validate.schema.middleware.js';
import { CreatePostSchema } from '../schemas/post.schemas.js';

const postRouter = Router();

postRouter.get('/', verifyUser, asyncWrapper(postController.getAll));
postRouter.post('/', verifyUser, validateSchema(CreatePostSchema), asyncWrapper(postController.create));

export default postRouter;
