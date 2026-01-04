import express, { type Request, type Response, type Application, type NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import appRoutes from './global/routes/app.routes.ts';
import { StatusCodes } from "http-status-codes";
import path from 'path';
import pageRouter from './global/routes/page.routes.ts';
import './global/config/passport.config.ts';
import passport from 'passport';

class Server {
    private app: Application;
    private port: number = 3000;

    constructor() {
        this.app = express();
    }

    public start(): void {
        this.setupMiddleware();
        this.setupExpressConfig();
        this.setupRoutes();
        this.setupErrorHandler();
        this.setupServer();
    }

    private setupMiddleware(): void {
        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.use(passport.initialize());
    }

    private setupExpressConfig():void {
        this.app.use(express.static(path.join(process.cwd(), 'public')));
    }

    private setupRoutes(): void {
        appRoutes(this.app);
        this.app.use(pageRouter);
    }

    private setupErrorHandler(): void {
        //404
        this.app.use((req: Request, res:Response, next: NextFunction) => {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: `The URL ${req.originalUrl} not found for method ${req.method}`
            });
        });

        //Error Handler
        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            const statusCode = err.statusCode || 500;
            res.status(statusCode).json({
                status: err.status || 'error',
                message: err.message || 'Internal server error'
            });
        });
    }

    private setupServer(): void {
        this.app.listen(this.port, () => {
            console.log(`Connected to Server with Port ${this.port}`);
        });
    }
}

export default Server;