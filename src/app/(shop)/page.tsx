import { getPaginatedProductsWithImages } from "@/actions";
import { ProductGrid, Title } from "@/components";
import { redirect } from "next/navigation";
// import { initialData } from "@/seed/seed";

// const products = initialData.products;

interface Props {
    searchParams: Promise<{ page?: string }>;
}

export default async function HomePage({ searchParams }: Props) {
    const { page } = await searchParams;
    const pageParam = page ? parseInt(page) : 1;

    const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({
        page: pageParam,
    });

    if (products.length === 0) {
        redirect("/");
    }

    return (
        <>
            <Title title="Tienda" subtitle="Todos los productos" className="mb-2" />

            <ProductGrid products={products} />
        </>
    );
}
