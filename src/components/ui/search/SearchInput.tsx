"use client";

import { useState, useEffect, useRef } from "react";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";
import { useSearchStore, useUIStore } from "@/store";
import { searchProducts } from "@/actions";
import { useRouter } from "next/navigation";
import clsx from "clsx";

interface Props {
    className?: string;
    placeholder?: string;
    showInSidebar?: boolean;
}

export const SearchInput = ({
    className,
    placeholder = "Buscar productos...",
    showInSidebar = false,
}: Props) => {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Store hooks
    const {
        searchTerm,
        showSearchInput,
        isSearching,
        setSearchTerm,
        setSearchResults,
        setIsSearching,
        toggleSearchInput,
        setShowSearchInput,
        clearSearch,
    } = useSearchStore();

    const closeSideMenu = useUIStore((state) => state.closeSideMenu);

    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    // Sincronizar localSearchTerm con searchTerm del store
    useEffect(() => {
        setLocalSearchTerm(searchTerm);
    }, [searchTerm]);

    // Manejar click fuera del componente y focus
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                !showInSidebar &&
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setShowSearchInput(false);
            }
        };

        const handleFocusOut = (event: FocusEvent) => {
            if (
                !showInSidebar &&
                containerRef.current &&
                !containerRef.current.contains(event.relatedTarget as Node)
            ) {
                // Pequeño delay para permitir clicks en botones dentro del componente
                setTimeout(() => {
                    setShowSearchInput(false);
                }, 100);
            }
        };

        if (showSearchInput && !showInSidebar) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("focusout", handleFocusOut);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("focusout", handleFocusOut);
        };
    }, [showSearchInput, showInSidebar, setShowSearchInput]);

    // Auto-focus cuando se abre el input
    useEffect(() => {
        if (showSearchInput && !showInSidebar && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showSearchInput, showInSidebar]);

    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (localSearchTerm !== searchTerm) {
                setSearchTerm(localSearchTerm);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [localSearchTerm, searchTerm, setSearchTerm]);

    // Perform search when searchTerm changes
    useEffect(() => {
        let isCancelled = false;

        const performSearch = async () => {
            setIsSearching(true);
            try {
                const result = await searchProducts({
                    q: searchTerm,
                    page: 1,
                    limit: 12,
                });

                // Solo actualizar si la búsqueda no fue cancelada
                if (!isCancelled) {
                    if (result.ok) {
                        setSearchResults(
                            result.products,
                            result.total,
                            result.page,
                            result.totalPages
                        );
                    } else {
                        setSearchResults([], 0, 1, 0);
                    }
                }
            } catch (error) {
                if (!isCancelled) {
                    console.error("Search error:", error);
                    setSearchResults([], 0, 1, 0);
                }
            } finally {
                if (!isCancelled) {
                    setIsSearching(false);
                }
            }
        };

        if (searchTerm.trim()) {
            performSearch();
        } else {
            // Si no hay término de búsqueda, limpiar resultados y loading inmediatamente
            setSearchResults([], 0, 1, 0);
            setIsSearching(false);
        }

        // Cleanup function para cancelar la búsqueda si el componente se desmonta o cambia el searchTerm
        return () => {
            isCancelled = true;
        };
    }, [searchTerm, setSearchResults, setIsSearching]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchTerm(e.target.value);
    };

    const handleClearSearch = () => {
        setLocalSearchTerm("");
        setIsSearching(false); // Resetear inmediatamente el loading
        clearSearch();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchTerm.trim()) {
            // Navigate to search page or products page with search
            router.push(`/gender/unisex?search=${encodeURIComponent(searchTerm)}`);

            // Cerrar el input de búsqueda del navbar
            if (!showInSidebar) {
                setShowSearchInput(false);
            }

            // Cerrar el sidebar si la búsqueda se realizó desde allí
            if (showInSidebar) {
                closeSideMenu();
            }
        }
        if (e.key === "Escape") {
            if (!showInSidebar) {
                setShowSearchInput(false);
            }
            handleClearSearch();
        }
    };

    // For navbar search (toggle behavior)
    if (!showInSidebar) {
        return (
            <div className={clsx("relative", className)} ref={containerRef}>
                {!showSearchInput ? (
                    <button
                        onClick={toggleSearchInput}
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
    }

    // For sidebar search (always visible)
    return (
        <div className={clsx("relative", className)}>
            <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                <IoSearchOutline className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                    ref={inputRef}
                    type="text"
                    value={localSearchTerm}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-1 outline-none text-sm bg-transparent"
                />
                {(localSearchTerm || isSearching) && (
                    <button
                        onClick={handleClearSearch}
                        className="p-1 hover:bg-gray-200 rounded transition-colors shrink-0"
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
    );
};
