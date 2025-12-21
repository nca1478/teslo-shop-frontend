export const revalidate = 60; // mantener página en cache por 60 seg

import { redirect } from "next/navigation";
import { Pagination, ProductGrid, Title } from "@/components";
import { Gender } from "@/interfaces";
import { getPaginatedProductsWithImages, searchProducts } from "@/actions";

interface Props {
    params: Promise<{ gender: Gender }>;
    searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function GenderPage({ params, searchParams }: Props) {
    const { gender } = await params;
    const { page, search } = await searchParams;
    const pageParam = page ? parseInt(page) : 1;

    // If there's a search term, use search functionality
    if (search && search.trim()) {
        const searchResult = await searchProducts({
            q: search,
            page: pageParam,
            limit: 12,
        });

        if (searchResult.ok) {
            return (
                <div className="space-y-6">
                    <Title
                        title={`Resultados de búsqueda: "${search}"`}
                        subtitle={`${searchResult.total} ${
                            searchResult.total === 1
                                ? "producto encontrado"
                                : "productos encontrados"
                        }`}
                        size="lg"
                        className="text-center sm:text-left"
                    />

                    <ProductGrid products={searchResult.products} />

                    {searchResult.totalPages > 1 && (
                        <Pagination totalPages={searchResult.totalPages} />
                    )}
                </div>
            );
        }
    }

    // Regular gender-based product listing
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

    const subtitles: Record<Gender, string> = {
        men: "Descubre la última moda masculina",
        women: "Encuentra tu estilo perfecto",
        kids: "Ropa cómoda y divertida para los más pequeños",
        unisex: "Estilos para todos",
    };

    return (
        <div className="space-y-6">
            <Title
                title={`Artículos para ${labels[gender]}`}
                subtitle={subtitles[gender]}
                size="lg"
                className="text-center sm:text-left"
            />

            <ProductGrid products={products} />

            <Pagination totalPages={totalPages} />
        </div>
    );
}
