import { Router } from 'express';
import { verifyUser } from '../../../global/middlewares/verify.user.middleware.js';
import asyncWrapper from '../../../global/core/asyncWrapper.core.js';
import { conversationController } from '../controllers/conversation.controller.js';
import { validateSchema } from '../../../global/middlewares/validate.schema.middleware.js';
import { createConversationSchema } from '../schema/conversation.schema.js';

const conversationRouter = Router();

conversationRouter.get('/', verifyUser, asyncWrapper(conversationController.getConversations));
conversationRouter.get('/:id', verifyUser, asyncWrapper(conversationController.getConversation));
conversationRouter.post('/', verifyUser, validateSchema(createConversationSchema), asyncWrapper(conversationController.createConversation));

export default conversationRouter;
