"use server";

import { userService } from "@/lib/services";
import { getSession, getAuthToken } from "@/lib/session";

export const getUserProfile = async () => {
    try {
        const session = await getSession();
        const token = await getAuthToken();

        if (!session || !token) {
            return {
                ok: false,
                message: "No hay sesión activa",
            };
        }

        const userProfile = await userService.getUserProfile(token);

        return {
            ok: true,
            user: userProfile,
        };
    } catch (error) {
        console.error("Get user profile error:", error);

        let message = "No se pudo obtener el perfil del usuario";

        if (error instanceof Error) {
            if (error.message.includes("Unauthorized")) {
                message = "Sesión expirada";
            } else if (error.message.includes("not found")) {
                message = "Usuario no encontrado";
            }
        }

        return {
            ok: false,
            message,
        };
    }
};
