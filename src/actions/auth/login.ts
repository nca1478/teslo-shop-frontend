"use server";

import { apiClient } from "@/lib/api";
import { setSession } from "@/lib/session";

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password) {
            return "InvalidCredentials";
        }

        const response = await apiClient.login({ email, password });

        // Guardar el token y datos del usuario en cookies seguras
        await setSession(response.token, response.user);

        return "Success";
    } catch (error) {
        console.error("Login error:", error);

        if (error instanceof Error) {
            if (error.message.includes("Invalid credentials")) {
                return "CredentialsSignin";
            }
            if (error.message.includes("not active")) {
                return "UserNotActive";
            }
        }

        return "UnknownError";
    }
}

export const login = async (email: string, password: string) => {
    try {
        const response = await apiClient.login({ email, password });

        // Guardar el token y datos del usuario en cookies seguras
        await setSession(response.token, response.user);

        return {
            ok: true,
            user: response.user,
        };
    } catch (error) {
        console.error("Login error:", error);

        let message = "No se pudo iniciar sesión";

        if (error instanceof Error) {
            if (error.message.includes("Invalid credentials")) {
                message = "Credenciales inválidas";
            } else if (error.message.includes("not active")) {
                message = "Usuario no activo";
            }
        }

        return {
            ok: false,
            message,
        };
    }
};
