import { getPaginatedProductsWithImages } from "@/actions";
import { ProductGrid, Title } from "@/components";
import { initialData } from "@/seed/seed";

const products = initialData.products;

export default async function HomePage() {
    const productsTemp = await getPaginatedProductsWithImages();

    console.log(productsTemp);

    return (
        <>
            <Title title="Tienda" subtitle="Todos los productos" className="mb-2" />

            <ProductGrid products={products} />
        </>
    );
}
