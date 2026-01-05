import type { Application } from "express";
import authRouter from "../../features/auth/routes/auth.route.js";
import buddyRouter from "../../features/social/routes/buddy.route.js";
import userRouter from "../../features/users/routes/user.route.js";

function appRoutes(app: Application): void {
    app.use('/', authRouter);
    app.use('/users', userRouter);
    app.use('/buddies', buddyRouter);
}

export default appRoutes