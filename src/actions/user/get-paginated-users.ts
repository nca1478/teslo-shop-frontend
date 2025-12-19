"use server";

import { getSession, getAuthToken } from "@/lib/session";
import { usersService } from "@/lib/services";
import { User } from "@/interfaces";

interface PaginationOptions {
    page?: number;
    take?: number;
}

export const getPaginatedUsers = async ({ page = 1, take = 5 }: PaginationOptions) => {
    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;

    const user = await getSession();
    const token = await getAuthToken();

    if (!user || !user.roles.includes("admin") || !token) {
        return {
            ok: false,
            message: "Acceso denegado - Solo para Administradores",
        };
    }

    try {
        const response = await usersService.getPaginatedUsers(
            {
                page,
                limit: take,
            },
            token
        );

        const users: User[] = response.users.map((user) => ({
            id: user.id,
            name: user.name, // Now both API and frontend use 'name'
            email: user.email,
            emailVerified: user.emailVerified,
            role: user.role,
            image: user.image,
            password: "",
        }));

        return {
            ok: true,
            users,
            currentPage: response.page,
            totalPages: response.totalPages,
        };
    } catch (error) {
        console.error("Error fetching paginated users:", error);

        if (error instanceof Error) {
            return {
                ok: false,
                message: error.message || "No se pudo cargar los usuarios",
            };
        } else {
            return {
                ok: false,
                message: "No se pudo cargar los usuarios",
            };
        }
    }
};
