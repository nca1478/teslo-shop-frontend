"use server";

import type { Address, Size } from "@/interfaces";
import { ordersService } from "@/lib/services";
import { getAuthToken } from "@/lib/session";

interface ProductToOrder {
    productId: string;
    quantity: number;
    size: Size;
}

export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {
    try {
        const token = await getAuthToken();

        // Verificar token de autenticación
        if (!token) {
            return {
                ok: false,
                message: "No hay sesión de usuario",
            };
        }

        return await ordersService.placeOrder(productIds, address, token);
    } catch (error) {
        console.log(error);

        if (error instanceof Error) {
            return { ok: false, message: error.message };
        } else {
            return { ok: false, message: "Error desconocido" };
        }
    }
};
