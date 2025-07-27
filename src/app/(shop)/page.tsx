export const revalidate = 60; // mantener página en cache por 60 seg

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { redirect } from "next/navigation";

interface Props {
    searchParams: Promise<{ page?: string }>;
}

export default async function HomePage({ searchParams }: Props) {
    const { page } = await searchParams;
    const pageParam = page ? parseInt(page) : 1;

    const { products, totalPages } = await getPaginatedProductsWithImages({
        page: pageParam,
    });

    if (products.length === 0) {
        redirect("/");
    }

    return (
        <>
            <Title title="Tienda" subtitle="Todos los productos" className="mb-2" />

            <ProductGrid products={products} />

            <Pagination totalPages={totalPages} />
        </>
    );
}
