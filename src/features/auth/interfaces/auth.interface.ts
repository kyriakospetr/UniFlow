export interface LocalSignUpDTO {
    email: string;
    username: string;
    password: string;
}

export interface SocialSignUpDTO {
    socialId: string;
}

export interface LocalLoginDTO {
    email: string;
    password: string;
}

export interface SocialLoginDTO {
    socialId: string;
}