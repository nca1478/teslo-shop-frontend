"use server";

import { userService } from "@/lib/services";
import { getSession, getAuthToken } from "@/lib/session";
import { UpdateUserProfileRequest } from "@/interfaces";

export const updateUserProfile = async (data: UpdateUserProfileRequest) => {
    try {
        const session = await getSession();
        const token = await getAuthToken();

        if (!session || !token) {
            return {
                ok: false,
                message: "No hay sesión activa",
            };
        }

        const updatedUser = await userService.updateUserProfile(data, token);

        return {
            ok: true,
            user: updatedUser,
            message: "Perfil actualizado correctamente",
        };
    } catch (error) {
        console.error("Update user profile error:", error);

        let message = "No se pudo actualizar el perfil";

        if (error instanceof Error) {
            if (error.message.includes("Unauthorized")) {
                message = "Sesión expirada";
            } else if (error.message.includes("Email already exists")) {
                message = "El email ya está en uso";
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
