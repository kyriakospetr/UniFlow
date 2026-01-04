import { Router } from "express";
import asyncWrapper from "../../../global/cores/asyncWrapper.core.ts";
import { authController } from "../controllers/auth.controller.ts";
import { validateSchema } from "../../../global/middlewares/validate.schema.middleware.ts";
import { LoginSchema, SignUpSchema } from "../schema/auth.schema.ts";


const authRouter = Router();

authRouter.post('/signup', validateSchema(SignUpSchema), asyncWrapper(authController.signUp));
authRouter.post('/auth/login', validateSchema(LoginSchema) ,asyncWrapper(authController.login));
authRouter.get('/auth/logout', asyncWrapper(authController.logout));

authRouter.get('/auth/google', authController.googleLogin);
authRouter.get('/auth/google/callback', authController.googleCallback);

export default authRouter;