"use server";

import { prisma } from "@/lib/prisma";

export const getPaginatedProductsWithImages = async () => {
    try {
        const products = await prisma.product.findMany({
            include: {
                ProductImage: {
                    take: 2,
                    select: {
                        url: true,
                    },
                },
            },
        });

        // parsear la respuesta (para que sea compatible con la interfaz Product)
        return {
            products: products.map((product) => {
                return {
                    ...product,
                    images: product.ProductImage.map((image) => image.url),
                };
            }),
            currentPage: 1,
            totalPages: 10,
        };
    } catch (error) {
        console.log(error);
        throw new Error("No se pudo cargar los productos");
    }
};
