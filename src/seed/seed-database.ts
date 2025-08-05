import { prisma } from "../lib/prisma";
import { initialData } from "./seed";
import { countries } from "./seed-countries";

async function main() {
    // 1. Borrar registros previos
    await prisma.userAddress.deleteMany();
    await prisma.user.deleteMany();
    await prisma.country.deleteMany();
    await prisma.$executeRaw`TRUNCATE TABLE ONLY public."ProductImage" RESTART IDENTITY CASCADE;`;
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    const { categories, products, users } = initialData;

    // 2. Agregar usuarios
    await prisma.user.createMany({
        data: users,
    });

    // 3. Agregar paises
    await prisma.country.createMany({
        data: countries,
    });

    // 4. Agregar categorias
    const categoriesData = categories.map((name) => ({ name }));
    await prisma.category.createMany({ data: categoriesData });

    const dbCategories = await prisma.category.findMany();
    const categoriesMap = dbCategories.reduce((map, category) => {
        map[category.name.toLowerCase()] = category.id;
        return map;
    }, {} as Record<string, string>);

    // 5. Agregar Productos
    products.forEach(async (product) => {
        const { type, images, ...rest } = product;

        const dbProduct = await prisma.product.create({
            data: {
                ...rest,
                categoryId: categoriesMap[type],
            },
        });

        // 6. Agregar Imagenes
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
