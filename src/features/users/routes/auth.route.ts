import { Router } from 'express';
import asyncWrapper from '../../../global/core/async.wrapper.core.js';
import { authController } from '../controllers/auth.controller.js';
import { validateSchema } from '../../../global/middlewares/validate.schema.middleware.js';
import { LoginSchema, SignUpSchema } from '../schema/auth.schema.js';

const authRouter = Router();

authRouter.post('/signup', validateSchema(SignUpSchema), asyncWrapper(authController.signUp));
authRouter.post('/auth/login', validateSchema(LoginSchema), asyncWrapper(authController.login));
authRouter.get('/auth/logout', asyncWrapper(authController.logout));

authRouter.get('/auth/google', authController.googleLogin);
authRouter.get('/auth/google/callback', authController.googleCallback);

export default authRouter;
