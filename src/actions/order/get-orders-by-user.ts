"use server";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const getOrdersByUser = async () => {
    const user = await getSession();

    if (!user) {
        return {
            ok: false,
            message: "Debe de estar autenticado",
        };
    }

    const orders = await prisma.order.findMany({
        where: {
            userId: user.id,
        },
        include: {
            OrderAddress: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
        },
    });

    return {
        ok: true,
        orders,
    };
};
