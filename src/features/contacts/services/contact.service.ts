import { BadRequestException, ConflictException, NotFoundException } from '../../../global/core/error.core.js';
import { prisma } from '../../../prisma.js';
import { userService } from '../../users/services/user.service.js';
import { AddContactDTO } from '../interfaces/contact.interface.js';
import { ContactTargetUserInfo } from '../types/contact.type.js';

class ContactService {
    public async createContact(reqBody: AddContactDTO, currentUser: UserPayload): Promise<ContactTargetUserInfo> {
        const { username } = reqBody;

        const targetUser = await userService.findUserByUsername(username);

        // Check if target username is valid
        if (!targetUser) {
            throw new NotFoundException('Invalid buddy username');
        }

        // Check if current user wants to add their self
        if (currentUser.id === targetUser.id) {
            throw new BadRequestException('You cannot add yourself as a buddy');
        }

        const existingContact = await prisma.contact.findUnique({
            where: {
                userId_targetUserId: { userId: currentUser.id, targetUserId: targetUser.id },
            },
        });

        // Check if the contact exists
        if (existingContact) {
            throw new ConflictException('Already in your buddies list');
        }

        // Create new contact
        const contact = await prisma.contact.create({
            data: {
                userId: currentUser.id,
                targetUserId: targetUser.id,
            },
            select: {
                targetUser: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });

        return contact.targetUser;
    }

    public async getContacts(currentUser: UserPayload): Promise<ContactTargetUserInfo[]> {
        const contacts = await prisma.contact.findMany({
            where: { userId: currentUser.id },
            select: {
                targetUser: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });

        // Prisma will return [{ buddy: {...} }, { buddy: {...} }]
        // We need to map so we get the inside object
        return contacts.map((c) => c.targetUser);
    }
}

export const contactService: ContactService = new ContactService();
