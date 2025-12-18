"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface PaginationOptions {
    page?: number;
    take?: number;
}

export const getPaginatedUsers = async ({ page = 1, take = 5 }: PaginationOptions) => {
    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;

    const session = await auth();

    if (session?.user.role !== "admin") {
        return {
            ok: false,
            message: "Acceso denegado - Solo para Administradores",
        };
    }

    try {
        const users = await prisma.user.findMany({
            take,
            skip: (page - 1) * take,
            orderBy: {
                name: "asc",
            },
        });

        const totalCount = await prisma.user.count();
        const totalPages = Math.ceil(totalCount / take);

        return {
            ok: true,
            users,
            currentPage: page,
            totalPages,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error("No se pudo cargar los usuarios", { cause: error });
        } else {
            throw new Error("No se pudo cargar los usuarios");
        }
    }
};
