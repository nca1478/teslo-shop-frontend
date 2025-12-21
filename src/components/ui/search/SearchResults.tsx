"use client";

import { useSearchStore } from "@/store";
import { ProductGrid } from "@/components";

interface Props {
    className?: string;
}

export const SearchResults = ({ className }: Props) => {
    const { searchTerm, searchResults, isSearching, totalResults } = useSearchStore();

    if (!searchTerm) {
        return null;
    }

    if (isSearching) {
        return (
            <div className={className}>
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Buscando productos...</span>
                </div>
            </div>
        );
    }

    if (searchResults.length === 0) {
        return (
            <div className={className}>
                <div className="text-center py-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No se encontraron productos
                    </h3>
                    <p className="text-gray-600">
                        No hay productos que coincidan con &ldquo;{searchTerm}&rdquo;
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                    Resultados de búsqueda para &ldquo;{searchTerm}&rdquo;
                </h2>
                <p className="text-gray-600 mt-1">
                    {totalResults}{" "}
                    {totalResults === 1 ? "producto encontrado" : "productos encontrados"}
                </p>
            </div>

            <ProductGrid products={searchResults} />
        </div>
    );
};
