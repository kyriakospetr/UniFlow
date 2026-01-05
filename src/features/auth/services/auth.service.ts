import type { Profile } from 'passport';
import { BadRequestException } from '../../../global/cores/error.core.js';
import { genereateJWT } from '../../../global/helpers/jwt.helper.js';
import { prisma } from '../../../prisma.js';
import type { LoginDTO, SignUpDTO } from '../interfaces/auth.interface.js';
import { userService } from '../../users/services/user.service.js';
import bcrypt from 'bcrypt';

class AuthService {
    public async signUp(reqBody: SignUpDTO): Promise<string> {
        const { email, username, password } = reqBody;

        // Check if there is a user with the same email or username
        const userUniqueEmail = await userService.findUserByEmail(email);

        const userUniqueUsername = await userService.findUserByUsername(username);

        if (userUniqueEmail) {
            throw new BadRequestException('Email is already in use');
        }

        if (userUniqueUsername) {
            throw new BadRequestException('Username is already in use');
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
            },
        });

        // Create JWT
        const accessToken = genereateJWT(user);

        // Return JWT
        return accessToken;
    }

    public async login(reqBody: LoginDTO): Promise<string> {
        const { email, password } = reqBody;

        // Find the user
        const user = await userService.findUserByEmail(email);

        // If user is null throw error
        if (!user) {
            throw new BadRequestException(`The email: ${email} does not exist`);
        }

        // If password is null throw error
        // Because password is optional at prisma User Model(as he can login with google/facebook) so its (string | null)
        // Bcrypt compare function only accepts string parameters
        if (!user.password) {
            throw new BadRequestException(`Password is not provided`);
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);

        // If password doesn't match throw error
        if (!passwordMatch) {
            throw new BadRequestException('Invalid Credentials');
        }

        // Create JWT
        const accessToken = genereateJWT(user);

        // Return JWT
        return accessToken;
    }

    public async syncOAuthProfile(profile: Profile): Promise<string> {
        const { id } = profile;

        // We get the email
        const email = profile.emails?.[0]?.value;

        // We check if email is missing
        if (!email) {
            throw new BadRequestException('Google account must have a primary email');
        }

        const username = email.split('@')[0];
        if(!username) {
          throw new BadRequestException("Username must be provided")
        }

        // Find the user if exists by googleId
        let user = await prisma.user.findUnique({
            where: { googleId: id },
        });

        if (!user) {
            // Find the user if exists by email (Local)
            user = await prisma.user.findUnique({
                where: { email: email },
            });

            if (user) {
                // If exists, we link the googleId with the account
                user = await prisma.user.update({
                    where: { email: email },
                    data: { googleId: id },
                });
            } else {
                // If user doesn't exist we create
                user = await prisma.user.create({
                    data: {
                        email,
                        username: username,
                        googleId: id,
                    },
                });
            }
        }

        // Return JWT
        return genereateJWT(user);
    }
}

export const authService: AuthService = new AuthService();
