"use server";

import { addressesService } from "@/lib/services";
import { getAuthToken } from "@/lib/session";

export const deleteUserAddress = async () => {
    try {
        const token = await getAuthToken();

        if (!token) {
            return {
                ok: false,
                message: "No se encontró token de autenticación",
            };
        }

        return await addressesService.deleteUserAddress(token);
    } catch (error) {
        console.log(error);

        return {
            ok: false,
            message: "No se pudo eliminar la direccion",
        };
    }
};
