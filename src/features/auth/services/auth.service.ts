import type { User } from '../../../../generated/prisma/client.js';
import { BadRequestException } from '../../../global/cores/error.core.js';
import { genereateJWT } from '../../../global/helpers/jwt.helper.js';
import { prisma } from '../../../prisma.js';
import type { LocalLoginDTO, LocalSignUpDTO } from '../interfaces/auth.interface.js';
import bcrypt from "bcrypt";

class AuthService {
    public async signUp(reqBody: LocalSignUpDTO): Promise<string> {
        const accessToken = await this.localSignUp(reqBody);
        return accessToken;
    }

    private async localSignUp(reqBody: LocalSignUpDTO): Promise<string> {
        const { email, username, password } = reqBody;

        // Check if there is a user with the same email or username
        const userUniqueEmail = await this.findUserByEmail(email);

        const userUniqueUsername = await this.findUserByUsername(username);

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
            password: hashedPassword
          }
        });

        // Create JWT
        const accessToken = genereateJWT(user);

        // Return JWT
        return accessToken;
    }

    public async login(reqBody: LocalLoginDTO): Promise<string> {
      const accessToken = await this.localLogin(reqBody)
      return accessToken;
    }

    private async localLogin(reqBody: LocalLoginDTO): Promise<string> {
      const {email, password} = reqBody;

      // Find the user
      const user = await this.findUserByEmail(email);

      // If user is null throw error
      if(!user) {
        throw new BadRequestException(`The email: ${email} does not exist`)
      }

      // If password is null throw error
      // Because password is optional at prisma User Model(as he can login with google/facebook) so its (string | null)
      // Bcrypt compare function only accepts string parameters
      if(!user.password) {
        throw new BadRequestException(`Password is not provided`)
      }

      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);

      // If password doesn't match throw error
      if(!passwordMatch) {
        throw new BadRequestException("Invalid Credentials");
      }

      // Create JWT
        const accessToken = genereateJWT(user);

      // Return JWT
      return accessToken;
    }

    private async findUserByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
    }

    private async findUserByUsername(username: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: {
                username: username,
            },
        });
    }
}

export const authService: AuthService = new AuthService();
