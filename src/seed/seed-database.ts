import { initialData } from "./seed";
import { prisma } from "../lib/prisma";

async function main() {
    // 1. Borrar registros previos
    await prisma.$executeRaw`TRUNCATE TABLE ONLY public."ProductImage" RESTART IDENTITY CASCADE;`;
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    // await Promise.all([
    //     await prisma.productImage.deleteMany(),
    //     await prisma.product.deleteMany(),
    //     await prisma.category.deleteMany(),
    // ]);

    const { categories, products } = initialData;

    // 2. Agregar categorias
    const categoriesData = categories.map((name) => ({ name }));
    await prisma.category.createMany({ data: categoriesData });

    const dbCategories = await prisma.category.findMany();

    const categoriesMap = dbCategories.reduce((map, category) => {
        map[category.name.toLowerCase()] = category.id;
        return map;
    }, {} as Record<string, string>);

    // 3. Agregar Productos
    products.forEach(async (product) => {
        const { type, images, ...rest } = product;

        const dbProduct = await prisma.product.create({
            data: {
                ...rest,
                categoryId: categoriesMap[type],
            },
        });

        // 4. Agregar Imagenes
        const imagesData = images.map((image) => ({
            url: image,
            productId: dbProduct.id,
        }));

        await prisma.productImage.createMany({
            data: imagesData,
        });
    });

    console.log("Seed ejecutado correctamente");
}

(() => {
    if (process.env.NODE_ENV === "production") return;

    main();
})();
