"use server";

import { apiClient } from "@/lib/api";
import { setSession } from "@/lib/session";

export const registerUser = async (fullName: string, email: string, password: string) => {
    try {
        if (!fullName || !email || !password) {
            throw new Error("Todos los campos son obligatorios");
        }

        const response = await apiClient.register({
            fullName,
            email,
            password,
        });

        // Guardar el token y datos del usuario en cookies seguras
        await setSession(response.token, response.user);

        return {
            ok: true,
            user: response.user,
            message: "Usuario creado exitosamente",
        };
    } catch (error) {
        console.error("Register error:", error);

        let message = "No se pudo crear el usuario";

        if (error instanceof Error) {
            if (error.message.includes("already exists")) {
                message = "El usuario ya existe";
            } else if (error.message.includes("validation")) {
                message = "Datos inválidos";
            }
        }

        return {
            ok: false,
            message,
        };
    }
};
