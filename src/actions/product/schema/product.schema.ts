import { z } from "zod";

// Validación de datos del formulario
export const productSchema = z.object({
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
    gender: z.enum(["men", "women", "kids", "unisex"]),
});
