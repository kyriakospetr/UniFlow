import express, { type Request, type Response, type Application } from 'express';

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

    }

    private setupExpressConfig():void {

    }

    private setupRoutes(): void {

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