"use server";

import { productsService } from "@/lib/services";

interface PaginationOptions {
    page?: number;
    take?: number;
    gender?: string;
}

export const getPaginatedProductsWithImages = async ({
    page = 1,
    take = 12,
    gender,
}: PaginationOptions) => {
    if (isNaN(Number(page)) || page < 1) page = 1;

    try {
        const response = await productsService.getProducts({
            page,
            limit: take,
            gender,
        });

        return {
            products: response.products.map((product) => ({
                ...product,
                inStock: product.stock,
                createdAt:
                    typeof product.createdAt === "string"
                        ? new Date(product.createdAt)
                        : product.createdAt,
                updatedAt:
                    typeof product.updatedAt === "string"
                        ? new Date(product.updatedAt)
                        : product.updatedAt,
            })),
            currentPage: response.page,
            totalPages: response.totalPages,
        };
    } catch (error) {
        console.log(error);
        throw new Error("No se pudo cargar los productos");
    }
};
