import { Router } from "express";


const authRouter = Router();

authRouter.post('/signup');
authRouter.post('/auth/login');
authRouter.get('/auth/logout');

export default authRouter;