export interface User {
    id: string;
    name: string;
    email: string;
    emailVerified?: Date | null;
    password: string;
    role: string;
    image?: string | null;
}

export interface UpdateUserProfileRequest {
    name?: string;
    email?: string;
    password?: string;
    image?: string;
}
