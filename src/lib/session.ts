import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "auth-token";
const USER_DATA_COOKIE_NAME = "user-data";

export interface User {
    id: string;
    email: string;
    fullName: string;
    roles: string[];
}

export async function getSession(): Promise<User | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
        const userData = cookieStore.get(USER_DATA_COOKIE_NAME)?.value;

        if (!token || !userData) {
            return null;
        }

        const user = JSON.parse(userData);
        return user;
    } catch (error) {
        console.error("Session verification failed:", error);
        return null;
    }
}

export async function setSession(token: string, user: User): Promise<void> {
    const cookieStore = await cookies();

    // Guardar el token
    cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
    });

    // Guardar los datos del usuario
    cookieStore.set(USER_DATA_COOKIE_NAME, JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
    });
}

export async function clearSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    cookieStore.delete(USER_DATA_COOKIE_NAME);
}
