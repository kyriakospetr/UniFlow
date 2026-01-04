interface UserPayload {
    id: string;
    username: string;
    email: string;
}

declare namespace Express {
    export interface Request {
        currentUser: UserPayload;
    }
}