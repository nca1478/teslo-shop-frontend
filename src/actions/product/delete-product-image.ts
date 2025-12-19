"use server";

import { productsService } from "@/lib/services";
import { getAuthToken } from "@/lib/session";
import { revalidatePath } from "next/cache";

export const deleteProductImage = async (
    imageId: number,
    imageUrl: string,
    productId?: string,
    productSlug?: string
) => {
    if (!imageUrl.startsWith("http")) {
        return {
            ok: false,
            error: "No se pueden borrar imagenes guardadas localmente",
        };
    }

    try {
        // Obtener token de autenticación
        const token = await getAuthToken();
        if (!token) {
            return {
                ok: false,
                error: "Token de autenticación no encontrado",
            };
        }

        // Si no se proporciona productId, extraerlo de la URL o usar un método alternativo
        if (!productId) {
            return {
                ok: false,
                error: "ID del producto requerido",
            };
        }

        // Usar el servicio del backend para eliminar la imagen
        await productsService.deleteProductImage(productId, imageUrl, token);

        // Revalidar los paths específicos
        revalidatePath(`/admin/products`);
        if (productSlug) {
            revalidatePath(`/admin/product/${productSlug}`);
        }

        return { ok: true };
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: "No se pudo eliminar la imagen",
        };
    }
};
