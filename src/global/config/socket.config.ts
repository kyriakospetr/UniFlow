import { Server as SocketIOServer } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { conversationService } from '../../features/chats/services/conversation.service.js';

let io: SocketIOServer;

export const initSocket = (httpServer: HTTPServer) => {
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: 'http://localhost:3000',
            credentials: true,
        },
        pingTimeout: 30000,
        pingInterval: 10000,
    });

    // Only authenticated users can listen to the socket server
    // If he is not authenticated then he can't listen to the socket
    io.use((socket, next) => {
        try {
            const cookies = cookie.parse(socket.handshake.headers.cookie || '');
            const token = cookies.accessToken;

            if (!token) {
                console.log(`Socket authentication failed: No token (socket id: ${socket.id})`);
                return next(new Error('Authentication error: No token'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
            socket.data.user = decoded;
            next();
        } catch (err) {
            console.log(`Socket authentication failed: Invalid token (socket id: ${socket.id})`, err);
            next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        const user = socket.data.user;
        console.log(`User connected: ${user.username} with socket ID: ${socket.id}`);

        socket.join(`user_${user.id}`);
        socket.on('join_chat', async (conversationId: string) => {
            // Only participants need to listen to the conversations
            // We check if the user asking to listen is a participant of the conversations
            // If we didn't do that, every authenticated user who knew the converesation Id
            // Could listen to the conversation messages even if he was not a participant
            const isMember = await conversationService.isConversationParticipant(user.id, conversationId);

            if (isMember) {
                socket.join(conversationId);
                console.log(`${user.username} joined chat ${conversationId}`);
            } else {
                console.log(`Unauthorized access attempt to ${conversationId}`);
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${user.username} (socket ID: ${socket.id})`);
        });
    });

    return io;
};

// To get the io instance for controllers
export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
