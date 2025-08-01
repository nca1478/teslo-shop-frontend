import { z } from "zod";
import bcryptjs from "bcryptjs";
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
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

    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (!parsedCredentials.success) return null;

                const { email, password } = parsedCredentials.data;

                // Buscar el correo
                const user = await prisma.user.findUnique({
                    where: { email: email.toLowerCase() },
                });

                if (!user) return null;

                // Verificar contraseña
                if (!bcryptjs.compareSync(password, user.password)) return null;

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password: _, ...rest } = user;

                return rest;
            },
        }),
    ],
};

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);
