import type { Application } from 'express';
import authRouter from '../../features/users/routes/auth.route.js';
import contactRouter from '../../features/contacts/routes/contact.route.js';
import userRouter from '../../features/users/routes/user.route.js';
import conversationRouter from '../../features/chats/routes/conversation.route.js';
import messageRouter from '../../features/chats/routes/message.route.js';
import postRouter from '../../features/posts/routes/post.route.js';

// Global routes
function appRoutes(app: Application): void {
    app.use('/', authRouter);
    app.use('/users', userRouter);
    app.use('/contacts', contactRouter);
    app.use('/conversations', conversationRouter);
    app.use('/conversations/:id/messages', messageRouter);
    app.use('/posts', postRouter)
}

export default appRoutes;
