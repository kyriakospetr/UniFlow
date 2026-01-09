import type { Profile } from 'passport';
import { BadRequestException, ConflictException, UnAuthorizedException } from '../../../global/core/error.core.js';
import { genereateJWT } from '../../../global/helpers/jwt.helper.js';
import { prisma } from '../../../prisma.js';
import type { LoginDTO, SignUpDTO } from '../../users/interfaces/auth.interface.js';
import { userService } from '../../users/services/user.service.js';
import bcrypt from 'bcrypt';

class AuthService {
    public async signUp(reqBody: SignUpDTO): Promise<string> {
        const { email, username, password } = reqBody;

        // Check if there is a user with the same email or username
        const userUniqueEmail = await userService.findUserByEmail(email);

        const userUniqueUsername = await userService.findUserByUsername(username);

        if (userUniqueEmail) {
            throw new ConflictException('Email is already in use');
        }

        if (userUniqueUsername) {
            throw new ConflictException('Username is already in use');
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
        // If password is null throw error
        // Because password is optional at prisma User Model(as he can login with google/facebook) so its (string | null)
        // Bcrypt compare function only accepts string parameters

        if (!user || !user.password) {
            throw new UnAuthorizedException(`Invalid Credentials`);
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);

        // If password doesn't match throw error
        if (!passwordMatch) {
            throw new UnAuthorizedException('Invalid Credentials');
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

        // Find the user if exists by googleId
        let user = await prisma.user.findUnique({
            where: { googleId: id },
        });

        if (!user) {
            // Find the user if exists by email (Local)
            user = await userService.findUserByEmail(email);

            if (user) {
                // If exists, we link the googleId with the account
                user = await prisma.user.update({
                    where: { email: email },
                    data: { googleId: id },
                });
            } else {
                /** If user doesn't exist we create one
                 * * There is a username collision problem.
                 * * If a userA has signed up locally e.g {username: user123, email: email@example.com}
                 * * And a userB tries to sign up with google oauth 2 using {email: user123@gmail.com}
                 * * Because we extract the username from the email, the userB username will be user123 same as UserA
                 * * So we increment in a loop and append to the username to avoid duplicate usernames and conflict erros
                */
                let username = email.split('@')[0];
                let uniqueUsername = username;
                let counter = 1;

                while (await userService.findUserByUsername(uniqueUsername)) {
                    uniqueUsername = `${username}${counter}`;
                    counter++;
                }

                username = uniqueUsername;
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
        const accessToken = genereateJWT(user);

        // Return JWT
        return accessToken;
    }
}

export const authService: AuthService = new AuthService();
