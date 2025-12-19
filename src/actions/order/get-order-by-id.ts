"use server";

import { ordersService } from "@/lib/services";
import { getAuthToken } from "@/lib/session";

export const getOrderById = async (id: string) => {
    try {
        const token = await getAuthToken();

        if (!token) {
            return {
                ok: false,
                message: "Debe de estar autenticado",
            };
        }

        const order = await ordersService.getOrderById(id, token);

        if (!order) {
            return {
                ok: false,
                message: "Orden no existe",
            };
        }

        return {
            ok: true,
            order,
        };
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: "Error al obtener la orden",
        };
    }
};
