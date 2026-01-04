import express, { type Application, type NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import appRoutes from './global/routes/app.routes';
import { StatusCodes } from "http-status-codes";

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
    }

    private setupExpressConfig():void {

    }

    private setupRoutes(): void {
        appRoutes(this.app);
    }

    private setupErrorHandler(): void {
        
    }

    private setupServer(): void {
        this.app.listen(this.port, () => {
            console.log(`Connected to Server with Port ${this.port}`);
        });
    }
}

export default Server;