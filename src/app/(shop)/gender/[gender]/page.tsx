import { redirect } from "next/navigation";
import { Pagination, ProductGrid, Title } from "@/components";
import { Gender } from "@/interfaces";
import { getPaginatedProductsWithImages } from "@/actions";

interface Props {
    params: Promise<{ gender: Gender }>;
    searchParams: Promise<{ page?: string }>;
}

export default async function GenderPage({ params, searchParams }: Props) {
    const { gender } = await params;
    const { page } = await searchParams;
    const pageParam = page ? parseInt(page) : 1;

    const { products, totalPages } = await getPaginatedProductsWithImages({
        page: pageParam,
        gender,
    });

    if (products.length === 0) {
        redirect(`/gender/${gender}`);
    }

    const labels: Record<Gender, string> = {
        men: "Hombres",
        women: "Mujeres",
        kids: "Niños",
        unisex: "Todos",
    };

    return (
        <>
            <Title title={`Artículos para ${labels[gender]}`} className="mb-2" />

            <ProductGrid products={products} />

            <Pagination totalPages={totalPages} />
        </>
    );
}
