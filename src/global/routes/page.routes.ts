// src/features/pages/routes/page.routes.ts
import { Router, type Request, type Response } from 'express';
import path from 'path';

const pageRouter = Router();

pageRouter.get('/login', (req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'public', 'login.html'));
});

pageRouter.get('/signup', (req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'public', 'signup.html'));
});

export default pageRouter;
