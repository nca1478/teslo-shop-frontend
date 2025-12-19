"use server";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const getOrderById = async (id: string) => {
    const user = await getSession();

    if (!user) {
        return {
            ok: false,
            message: "Debe de estar autenticado",
        };
    }

    try {
        const order = await prisma.order.findFirst({
            where: {
                id,
            },
            include: {
                OrderAddress: true,
                OrderItem: {
                    select: {
                        price: true,
                        quantity: true,
                        size: true,

                        product: {
                            select: {
                                title: true,
                                slug: true,
                                ProductImage: {
                                    select: { url: true },
                                    take: 1,
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!order) throw `El id ${id} no existe`;

        if (!user.roles.includes("admin")) {
            if (user.id !== order.userId) {
                throw `${id} no es del usuario logueado`;
            }
        }

        return {
            ok: true,
            order,
        };
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: "Orden no existe",
        };
    }
};
