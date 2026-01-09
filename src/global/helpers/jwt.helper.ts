import jwt from 'jsonwebtoken'
import type { User } from '../../../generated/prisma/browser.js'

//We generate the accessToken, based on the user id, email, username which are unique
export function genereateJWT(user: User): string {
    const accessToken = jwt.sign({
        id: user.id, email: user.email, username: user.username },
        process.env.JWT_SECRET!,
        {
            expiresIn: "1d"
        }
    );
    return accessToken;
}