"use server";

import { prisma } from "@/lib/prisma";

export const getProductBySlug = async (slug: string) => {
    try {
        const product = await prisma.product.findFirst({
            where: {
                slug,
            },
            include: {
                ProductImage: true,
            },
        });

        if (!product) return null;

        // verificar si el producto tiene imágenes
        const images =
            product.ProductImage.length > 0
                ? product.ProductImage.map((image) => image.url)
                : ["placeholder.png"];

        return {
            ...product,
            images,
        };
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
