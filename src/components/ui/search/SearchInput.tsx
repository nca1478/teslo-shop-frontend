"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";
import { useSearchStore, useUIStore } from "@/store";
import { searchProducts } from "@/actions";
import { useRouter } from "next/navigation";
import clsx from "clsx";

interface Props {
    className?: string;
    placeholder?: string;
}

export const SearchInput = ({ className, placeholder = "Buscar productos..." }: Props) => {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Store hooks
    const {
        showSearchInput,
        isSearching,
        setSearchResults,
        setIsSearching,
        setShowSearchInput,
        clearSearch,
    } = useSearchStore();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { closeSideMenu } = useUIStore();

    const [localSearchTerm, setLocalSearchTerm] = useState("");

    // Función para realizar búsqueda
    const performSearch = useCallback(
        async (searchTerm: string) => {
            if (!searchTerm.trim()) {
                setSearchResults([], 0, 1, 0);
                setIsSearching(false);
                return;
            }

            setIsSearching(true);
            try {
                const result = await searchProducts({
                    q: searchTerm,
                    page: 1,
                    limit: 12,
                });

                if (result.ok) {
                    setSearchResults(result.products, result.total, result.page, result.totalPages);
                } else {
                    setSearchResults([], 0, 1, 0);
                }
            } catch (error) {
                console.error("Search error:", error);
                setSearchResults([], 0, 1, 0);
            } finally {
                setIsSearching(false);
            }
        },
        [setSearchResults, setIsSearching]
    );

    // Manejar click fuera del componente
    useEffect(() => {
        if (!showSearchInput) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSearchInput(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showSearchInput, setShowSearchInput]);

    // Manejar cambios en el input con búsqueda inmediata
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalSearchTerm(value);

        // Cancelar búsqueda anterior si existe
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = null;
        }

        // Búsqueda inmediata
        performSearch(value);
    };

    // Manejar apertura del input de búsqueda
    const handleToggleSearch = () => {
        setShowSearchInput(true);
        // Limpiar estado al abrir
        setLocalSearchTerm("");
        setSearchResults([], 0, 1, 0);
        setIsSearching(false);

        // Focus después del render
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const handleClearSearch = () => {
        setLocalSearchTerm("");
        setIsSearching(false);
        clearSearch();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && localSearchTerm.trim()) {
            router.push(`/gender/unisex?search=${encodeURIComponent(localSearchTerm)}`);
            setShowSearchInput(false);
        }

        if (e.key === "Escape") {
            setShowSearchInput(false);
            handleClearSearch();
        }
    };

    // Navbar search (toggle behavior)
    return (
        <div className={clsx("relative", className)} ref={containerRef}>
            {!showSearchInput ? (
                <button
                    onClick={handleToggleSearch}
                    className="p-2 rounded-md transition-all hover:bg-gray-100"
                    aria-label="Buscar productos"
                >
                    <IoSearchOutline className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            ) : (
                <>
                    {/* Botón de búsqueda visible para mantener el espacio */}
                    <button
                        className="p-2 rounded-md transition-all hover:bg-gray-100 opacity-50"
                        aria-label="Buscar productos"
                        disabled
                    >
                        <IoSearchOutline className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                    {/* Input de búsqueda posicionado absolutamente */}
                    <div className="absolute top-0 right-0 z-50 bg-white border border-gray-300 rounded-md px-3 py-2 shadow-lg w-[280px] sm:w-[320px] transform transition-all duration-200 ease-out">
                        <div className="flex items-center space-x-2">
                            <IoSearchOutline className="w-4 h-4 text-gray-400 shrink-0" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={localSearchTerm}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder={placeholder}
                                className="flex-1 outline-none text-sm"
                            />
                            {(localSearchTerm || isSearching) && (
                                <button
                                    onClick={handleClearSearch}
                                    className="p-1 hover:bg-gray-100 rounded transition-colors shrink-0"
                                    aria-label="Limpiar búsqueda"
                                >
                                    {isSearching ? (
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400"></div>
                                    ) : (
                                        <IoCloseOutline className="w-3 h-3 text-gray-400" />
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
