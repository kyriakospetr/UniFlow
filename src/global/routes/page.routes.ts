// src/features/pages/routes/page.routes.ts
import { Router, type Request, type Response } from 'express';
import path from 'path';
import { verifyUser } from '../middlewares/verify.user.middleware.js';

const pageRouter = Router();

pageRouter.get('/login', (req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'public', 'login.html'));
});

pageRouter.get('/signup', (req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'public', 'signup.html'));
});

pageRouter.get('/', verifyUser, (req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

export default pageRouter;
