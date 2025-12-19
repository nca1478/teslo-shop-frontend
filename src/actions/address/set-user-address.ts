"use server";

import type { Address } from "@/interfaces";
import { addressesService } from "@/lib/services";
import { getAuthToken } from "@/lib/session";

export const setUserAddress = async (address: Address) => {
    try {
        const token = await getAuthToken();

        if (!token) {
            return {
                ok: false,
                message: "No se encontró token de autenticación",
            };
        }

        return await addressesService.setUserAddress(address, token);
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: "No se pudo grabar la dirección",
        };
    }
};
