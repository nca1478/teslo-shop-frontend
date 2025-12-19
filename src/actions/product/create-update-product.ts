"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import { productsService } from "@/lib/services";
import { getAuthToken } from "@/lib/session";
import { Gender } from "@/generated/prisma";
import { Size } from "@/interfaces";

// configurar url cloudinary (subir imagenes)
cloudinary.config(process.env.CLOUDINARY_URL ?? "");

// Validación de datos del formulario
const productSchema = z.object({
    id: z.uuid().optional().nullable(),
    title: z.string().min(3).max(255),
    // slug: z.string().min(3).max(255),
    slug: z.coerce
        .string()
        .min(3)
        .max(255)
        .transform((val) => val.toLowerCase().replace(/ /g, "_").trim()),
    description: z.string(),
    price: z.coerce
        .number()
        .min(0)
        .transform((val) => Number(val.toFixed(2))),
    inStock: z.coerce
        .number()
        .min(0)
        .transform((val) => Number(val.toFixed(0))),
    categoryId: z.uuid(),
    sizes: z.coerce.string().transform((val) => val.split(",")),
    tags: z.string(),
    gender: z.enum(Gender),
});

export const createUpdateProduct = async (formData: FormData) => {
    const data = Object.fromEntries(formData);
    const productParsed = productSchema.safeParse(data);

    if (!productParsed.success) {
        console.log(productParsed.error);
        return { ok: false };
    }

    const product = productParsed.data;

    // transforma slug a url amigable (alternativa a zod)
    // product.slug = product.slug.toLowerCase().replace(/ /g, "_").trim();

    const { id, ...rest } = product;

    try {
        // Obtener token de autenticación
        const token = await getAuthToken();
        if (!token) {
            return {
                ok: false,
                message: "Token de autenticación no encontrado",
            };
        }

        // Cargar y subir las imágenes primero
        let images: string[] = [];
        if (formData.getAll("images")) {
            const uploadedImages = await uploadImages(formData.getAll("images") as File[]);
            if (!uploadedImages) {
                throw new Error("Error al subir las imágenes");
            }
            images = uploadedImages.filter((img) => img !== null) as string[];
        }

        const tagsArray = rest.tags.split(",").map((tag) => tag.trim().toLowerCase());

        const productData = {
            title: rest.title,
            description: rest.description,
            price: rest.price,
            slug: rest.slug,
            stock: rest.inStock,
            sizes: rest.sizes,
            gender: rest.gender,
            tags: tagsArray,
            images: images,
            categoryId: rest.categoryId,
        };

        let resultProduct;

        if (id) {
            // Actualizar producto existente
            resultProduct = await productsService.updateProduct(id, productData, token);
        } else {
            // Crear nuevo producto
            resultProduct = await productsService.createProduct(productData, token);
        }

        // revalidar los paths
        revalidatePath("/admin/products");
        revalidatePath(`/admin/product/${resultProduct.slug}`);
        revalidatePath(`/products/${resultProduct.slug}`);

        return {
            ok: true,
            product: resultProduct,
        };
    } catch (error) {
        console.log(error);
        let message = "Revisar los logs, no se pudo actualizar/crear";

        if (error instanceof Error) {
            message = error.message;
        }

        return {
            ok: false,
            message,
        };
    }
};

const uploadImages = async (images: File[]) => {
    try {
        const uploadPromises = images.map(async (image) => {
            try {
                const buffer = await image.arrayBuffer();
                const base64Image = Buffer.from(buffer).toString("base64");

                return cloudinary.uploader
                    .upload(`data:image/png;base64,${base64Image}`)
                    .then((res) => res.secure_url);
            } catch (error) {
                console.log(error);
                return null;
            }
        });

        const uploadedImages = await Promise.all(uploadPromises);
        return uploadedImages;
    } catch (error) {
        console.log(error);
        return null;
    }
};
