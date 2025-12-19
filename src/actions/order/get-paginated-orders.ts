"use server";

import { getSession, getAuthToken } from "@/lib/session";
import { ordersService } from "@/lib/services";

interface PaginationOptions {
    page?: number;
    take?: number;
}

export const getPaginatedOrders = async ({ page = 1, take = 10 }: PaginationOptions = {}) => {
    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;

    const user = await getSession();

    if (!user || !user.roles.includes("admin")) {
        return {
            ok: false,
            message: "Debe de estar autenticado como administrador",
        };
    }

    const token = await getAuthToken();
    if (!token) {
        return {
            ok: false,
            message: "Token de autenticación no encontrado",
        };
    }

    try {
        const result = await ordersService.getAllOrders(token, page, take);

        return {
            ok: result.ok,
            orders: result.orders || [],
            currentPage: result.page || page,
            totalPages: result.totalPages || 0,
            total: result.total || 0,
            message: result.message,
        };
    } catch (error) {
        console.error("Error al obtener las órdenes:", error);
        return {
            ok: false,
            message: "Error al obtener las órdenes",
            orders: [],
            currentPage: page,
            totalPages: 0,
            total: 0,
        };
    }
};
