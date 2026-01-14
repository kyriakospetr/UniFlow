import { Router } from 'express';
import { verifyUser } from '../../../global/middlewares/verify.user.middleware.js';
import { validateSchema } from '../../../global/middlewares/validate.schema.middleware.js';
import { SendMessageSchema } from '../schema/message.schema.js';
import asyncWrapper from '../../../global/core/async.wrapper.core.js';
import { messageController } from '../controllers/message.controller.js';

const messageRouter = Router({ mergeParams: true });

messageRouter.get('/', verifyUser, asyncWrapper(messageController.getAll));
messageRouter.post('/', verifyUser, validateSchema(SendMessageSchema), asyncWrapper(messageController.send));

export default messageRouter;
