import { Router } from "express";
import { verifyUser } from "../../../global/middlewares/verify.user.middleware.js";
import asyncWrapper from "../../../global/cores/asyncWrapper.core.js";
import { userController } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get('/me', verifyUser, asyncWrapper(userController.getCurrentUser));

export default userRouter;