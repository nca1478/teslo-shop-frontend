import { ProductGrid, Title } from "@/components";
import { Gender } from "@/interfaces";
import { initialData } from "@/seed/seed";

interface Props {
    params: Promise<{ gender: Gender }>;
}

const seedProducts = initialData.products;

export default async function CategoryPage({ params }: Props) {
    const { gender } = await params;

    const products = seedProducts.filter((product) => product.gender === gender);

    const labels: Record<Gender, string> = {
        men: "Hombres",
        women: "Mujeres",
        kids: "Niños",
        unisex: "Unisex",
    };

    return (
        <>
            <Title title={`Artículos para ${labels[gender]}`} className="mb-2" />

            <ProductGrid products={products} />
        </>
    );
}
