"use server";

import { Gender } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

interface PaginationOptions {
    page?: number;
    take?: number;
    gender?: Gender;
}

export const getPaginatedProductsWithImages = async ({
    page = 1,
    take = 12,
    gender,
}: PaginationOptions) => {
    if (isNaN(Number(page)) || page < 1) page = 1;

    try {
        // 1. Obtener los productos
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
            // filtrar por género, null: muestra todos los productos
            where: { gender },
            orderBy: {
                title: "asc",
            },
        });

        // 2. Obtener el total de paginas
        const totalCount = await prisma.product.count({ where: { gender } });
        const totalPages = Math.ceil(totalCount / take);

        // 3. Parsear la respuesta (para compatibilidad con interfaz Product)
        return {
            products: products.map((product) => {
                return {
                    ...product,
                    images: product.ProductImage.map((image) => image.url),
                };
            }),
            currentPage: page,
            totalPages,
        };
    } catch (error) {
        console.log(error);
        throw new Error("No se pudo cargar los productos");
    }
};
