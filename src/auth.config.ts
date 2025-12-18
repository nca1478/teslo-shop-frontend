import { type NextAuthConfig } from "next-auth";
import { protectedRoutes } from "./config";

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: "/auth/login",
        newUser: "/auth/new-account",
    },

    callbacks: {
        // Se ejecuta cuando se crea un token JWT
        jwt({ token, user }) {
            if (user) {
                token.data = user;
            }

            return token;
        },

        // Se ejecuta cuando se crea una sesión
        session({ session, token }) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            session.user = token.data as any;

            return session;
        },

        // Verifica si el usuario está autorizado para acceder a la ruta protegida
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnProtectedRoute = protectedRoutes.includes(nextUrl.pathname);
            if (isOnProtectedRoute) {
                if (isLoggedIn) return true;
                return false;
            }
            return true;
        },
    },

    providers: [],
};
