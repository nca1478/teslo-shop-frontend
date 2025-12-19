"use server";

import { productsService } from "@/lib/services";

export const getProductBySlug = async (slug: string) => {
    try {
        const product = await productsService.getProductBySlug(slug);

        if (!product) return null;

        // No agregar placeholder automáticamente - dejar que el formulario maneje imágenes vacías
        const images = product.images || [];

        return {
            ...product,
            images,
            inStock: product.stock, // Mapear stock a inStock para compatibilidad
            // Convertir images array a ProductImage objects para compatibilidad con el formulario
            // Solo crear ProductImage objects si hay imágenes reales
            ProductImage:
                images.length > 0
                    ? images.map((url, index) => ({
                          id: index + 1, // ID temporal para el formulario
                          url,
                          productId: product.id,
                      }))
                    : [],
            createdAt:
                typeof product.createdAt === "string"
                    ? new Date(product.createdAt)
                    : product.createdAt,
            updatedAt:
                typeof product.updatedAt === "string"
                    ? new Date(product.updatedAt)
                    : product.updatedAt,
        };
    } catch (error) {
        // Si el producto no se encuentra, devolver null en lugar de lanzar error
        if (error instanceof Error && error.message.includes("404")) {
            return null;
        }

        if (error instanceof Error) {
            throw new Error("Error al obtener el producto por slug", {
                cause: error,
            });
        } else {
            throw new Error("Error al obtener el producto por slug");
        }
    }
};
