import { User } from '../../../../generated/prisma/client.js';
import { prisma } from '../../../prisma.js';

class UserService {
    public async findUserByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
    }

    public async findUserByUsername(username: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: {
                username: username,
            },
        });
    }
}

export const userService: UserService = new UserService();
