import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "auth-token";
const USER_DATA_COOKIE_NAME = "user-data";

export interface User {
    id: string;
    email: string;
    name: string;
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

        // Validar que userData sea un JSON válido
        try {
            const user = JSON.parse(userData);
            // Validar que el usuario tenga las propiedades requeridas
            if (!user.id || !user.email) {
                return null;
            }
            return user;
        } catch (parseError) {
            console.warn("Invalid user data in cookie:", parseError);
            return null;
        }
    } catch (error) {
        // Solo log en desarrollo para evitar spam en producción
        if (process.env.NODE_ENV === "development") {
            console.warn("Session verification failed:", error);
        }
        return null;
    }
}

export async function getAuthToken(): Promise<string | null> {
    try {
        const cookieStore = await cookies();
        return cookieStore.get(SESSION_COOKIE_NAME)?.value || null;
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.warn("Token retrieval failed:", error);
        }
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
