"use server";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const getPaginatedOrders = async () => {
    const user = await getSession();

    if (!user || !user.roles.includes("admin")) {
        return {
            ok: false,
            message: "Debe de estar autenticado como administrador",
        };
    }

    const orders = await prisma.order.findMany({
        include: {
            OrderAddress: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return {
        ok: true,
        orders,
    };
};
