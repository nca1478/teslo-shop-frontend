"use server";

import { prisma } from "@/lib/prisma";

// import { sleep } from "@/utils";

export const getStockBySlug = async (slug: string): Promise<number> => {
    try {
        // ralentizar para probar el skeleton (loading animation)
        // await sleep(1);

        const product = await prisma.product.findFirst({
            where: {
                slug,
            },
            select: { inStock: true },
        });

        return product?.inStock ?? 0;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error("Error al obtener el producto por slug", {
                cause: error,
            });
        } else {
            throw new Error("Error al obtener el producto por slug");
        }
    }
};
