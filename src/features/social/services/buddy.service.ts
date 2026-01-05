import { Contact } from '../../../../generated/prisma/client.js';
import { BadRequestException } from '../../../global/cores/error.core.js';
import { prisma } from '../../../prisma.js';
import { userService } from '../../users/services/user.service.js';
import { FindBuddyDTO } from '../interfaces/buddy.interface.js';

class BuddyService {
    public async findBuddy(reqBody: FindBuddyDTO, currentUser: UserPayload): Promise<Contact> {
        const { username } = reqBody;

        const buddy = await userService.findUserByUsername(username);

        // Check if buddy username is valid
        if (!buddy) {
            throw new BadRequestException('Invalid buddy username');
        }

        // Check if current user wants to add itself
        if (currentUser.id === buddy.id) {
            throw new BadRequestException('You cannot add yourself as a buddy');
        }

        const existingContact = await prisma.contact.findUnique({
            where: {
                userId_buddyId: { userId: currentUser.id, buddyId: buddy.id },
            },
        });

        // Check if the contact exists
        if (existingContact) {
            throw new BadRequestException('Already in your buddies list');
        }

        // Create new contact
        const contact = await prisma.contact.create({
            data: {
                userId: currentUser.id,
                buddyId: buddy.id,
            },
        });

        return contact;
    }

    public async listAllBuddies(currentUser: UserPayload): Promise<Contact[]> {
        return await prisma.contact.findMany({
            where: {
                userId: currentUser.id,
            },
            include: {
                buddy: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
            },
        });
    }
}

export const buddyService: BuddyService = new BuddyService();
