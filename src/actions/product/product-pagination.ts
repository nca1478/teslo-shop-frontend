"use server";

import { prisma } from "@/lib/prisma";

interface PaginationOptions {
    page?: number;
    take?: number;
}

export const getPaginatedProductsWithImages = async ({
    page = 1,
    take = 12,
}: PaginationOptions) => {
    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;

    try {
        const products = await prisma.product.findMany({
            take: take,
            skip: (page - 1) * take,
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
