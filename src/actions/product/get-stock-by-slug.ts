"use server";

import { productsService } from "@/lib/services";

// import { sleep } from "@/utils";

export const getStockBySlug = async (slug: string): Promise<number> => {
    try {
        // ralentizar para probar el skeleton (loading animation)
        // await sleep(1);

        const product = await productsService.getProductBySlug(slug);

        return product?.stock ?? 0;
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
