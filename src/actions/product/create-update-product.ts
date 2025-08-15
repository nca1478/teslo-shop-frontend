"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Gender, Product } from "@/generated/prisma";
import { Size } from "@/interfaces";

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
        const prismaTx = await prisma.$transaction(async (tx) => {
            let product;
            const tagsArray = rest.tags.split(",").map((tag) => tag.trim().toLowerCase());

            if (id) {
                // Actualizar
                product = await tx.product.update({
                    where: { id },
                    data: {
                        ...rest,
                        sizes: {
                            set: rest.sizes as Size[],
                        },
                        tags: {
                            set: tagsArray,
                        },
                    },
                });

                console.log({ updatedProduct: product });
            } else {
                // Crear
            }

            return {
                ok: true,
            };
        });

        return {
            ok: true,
        };
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: "Revisar los logs, no se pudo actualizar/crear",
        };
    }
};
