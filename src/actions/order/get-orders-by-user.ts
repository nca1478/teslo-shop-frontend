"use server";

import { ordersService } from "@/lib/services";
import { getAuthToken } from "@/lib/session";

export const getOrdersByUser = async () => {
    try {
        const token = await getAuthToken();

        if (!token) {
            return {
                ok: false,
                message: "Debe de estar autenticado",
            };
        }

        const orders = await ordersService.getMyOrders(token);

        return {
            ok: true,
            orders,
        };
    } catch (error) {
        console.log(error);

        return {
            ok: false,
            message: "Error al obtener las órdenes",
        };
    }
};
