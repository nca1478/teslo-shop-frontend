"use server";

import { productsService } from "@/lib/services";
import { SearchProductsRequest } from "@/interfaces";

export const searchProducts = async (params: SearchProductsRequest) => {
    try {
        if (!params.q || params.q.trim() === "") {
            return {
                ok: true,
                products: [],
                total: 0,
                page: 1,
                totalPages: 0,
            };
        }

        const response = await productsService.searchProducts(params);

        return {
            ok: true,
            ...response,
        };
    } catch (error) {
        console.error("Search products error:", error);

        return {
            ok: false,
            message: "No se pudo realizar la búsqueda",
            products: [],
            total: 0,
            page: 1,
            totalPages: 0,
        };
    }
};
