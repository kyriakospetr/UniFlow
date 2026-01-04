import type { Application } from "express";
import authRouter from "../../features/auth/routes/auth.route.js";

function appRoutes(app: Application): void {
    app.use('/', authRouter);
}

export default appRoutes