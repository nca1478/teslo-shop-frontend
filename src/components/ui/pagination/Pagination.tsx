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
        <div className="flex text-center justify-center mt-10 mb-20">
            <nav aria-label="Page navigation example">
                <ul className="flex list-style-none">
                    {/* Botón Anterior */}
                    <li className="page-item">
                        <Link
                            className="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
                            href={createPageUrl(currentPage - 1)}
                        >
                            <IoChevronBackOutline size={30} />
                        </Link>
                    </li>

                    {/* Botones de números */}
                    {allPages.map((page, index) => (
                        <li key={index} className="page-item">
                            <Link
                                className={clsx(
                                    "page-link relative block py-1.5 px-3 border-0 outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none",
                                    {
                                        "bg-black shadow-sm text-white hover:bg-gray-600 hover:text-white":
                                            page === currentPage,
                                    }
                                )}
                                href={createPageUrl(page)}
                            >
                                {page}
                            </Link>
                        </li>
                    ))}

                    {/* Boton de Siguiente */}
                    <li className="page-item">
                        <Link
                            className="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
                            href={createPageUrl(currentPage + 1)}
                        >
                            <IoChevronForwardOutline size={30} />
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};
