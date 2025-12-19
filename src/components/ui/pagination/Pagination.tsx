"use client";

import Link from "next/link";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { generatePaginationNumbers } from "@/utils";
import clsx from "clsx";

interface Props {
    totalPages: number;
}

export const Pagination = ({ totalPages }: Props) => {
    const pathname = usePathname(); // obtener ruta actual
    const searchParams = useSearchParams(); // obtener parámetros de la ruta
    const pageString = searchParams.get("page") ?? 1; // verificar si hay parámetros en la ruta

    // si los params son válidos devuelva 1, si no convierta los params en número
    const currentPage = isNaN(+pageString) ? 1 : +pageString;

    // redirijar al pathname actual, si la página actual (url) no es válida
    if (currentPage < 1 || isNaN(+pageString)) {
        redirect(pathname);
    }

    const allPages = generatePaginationNumbers(currentPage, totalPages); // generar números de la paginación

    const createPageUrl = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);

        if (pageNumber === "...") {
            return `${pathname}?${params.toString()}`;
        }

        if (+pageNumber <= 0) {
            return `${pathname}`;
        }

        if (+pageNumber > totalPages) {
            return `${pathname}?${params.toString()}`;
        }

        params.set("page", pageNumber.toString());

        return `${pathname}?${params.toString()}`;
    };

    return (
        <div className="flex justify-center mt-8 mb-12">
            <nav aria-label="Navegación de páginas" className="flex items-center">
                <div className="flex items-center space-x-1 sm:space-x-2">
                    {/* Botón Anterior */}
                    <Link
                        className={clsx(
                            "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg border transition-all duration-200",
                            currentPage <= 1
                                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                        )}
                        href={createPageUrl(currentPage - 1)}
                        aria-label="Página anterior"
                    >
                        <IoChevronBackOutline size={16} className="sm:w-5 sm:h-5" />
                    </Link>

                    {/* Botones de números */}
                    <div className="flex items-center space-x-1">
                        {allPages.map((page, index) => (
                            <Link
                                key={index}
                                className={clsx(
                                    "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg border text-sm sm:text-base font-medium transition-all duration-200",
                                    page === currentPage
                                        ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                                        : page === "..."
                                        ? "border-transparent text-gray-500 cursor-default"
                                        : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                                )}
                                href={createPageUrl(page)}
                                aria-label={page === "..." ? undefined : `Ir a página ${page}`}
                                aria-current={page === currentPage ? "page" : undefined}
                            >
                                {page}
                            </Link>
                        ))}
                    </div>

                    {/* Botón Siguiente */}
                    <Link
                        className={clsx(
                            "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg border transition-all duration-200",
                            currentPage >= totalPages
                                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                        )}
                        href={createPageUrl(currentPage + 1)}
                        aria-label="Página siguiente"
                    >
                        <IoChevronForwardOutline size={16} className="sm:w-5 sm:h-5" />
                    </Link>
                </div>
            </nav>
        </div>
    );
};
