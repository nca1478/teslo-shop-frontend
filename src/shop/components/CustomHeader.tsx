import { useRef, type KeyboardEvent } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomLogo } from "@/components/custom/CustomLogo";
import { useAuthStore } from "@/auth/store/auth.store";

export const CustomHeader = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { gender } = useParams();
    const { authStatus, isAdmin, logout } = useAuthStore();

    const inputRef = useRef<HTMLInputElement>(null);
    const query = searchParams.get("query") || "";

    const handleSearch = (event: KeyboardEvent<HTMLInputElement>) => {
        // Solo ejecuta si se presiona Enter
        if (event.key !== "Enter") return;

        // Obtiene el valor del input
        const query = inputRef.current?.value;

        // Crea nuevos parámetros de búsqueda
        const newSearchParams = new URLSearchParams();

        if (!query) {
            // Elimina el parámetro si no hay query
            newSearchParams.delete("query");
        } else {
            // Establece el parámetro query
            newSearchParams.set("query", inputRef.current!.value);
        }

        // Actualiza los parámetros de la URL
        setSearchParams(newSearchParams);
    };

    const clearInput = () => {
        if (inputRef.current) {
            inputRef.current.value = "";
        }
        // Limpiar también los searchParams
        setSearchParams(new URLSearchParams());
    };

    const selectNavigation = (selectedGender: undefined | "men" | "women" | "kid") => {
        return cn(
            "text-sm font-medium transition-colors hover:text-primary",
            selectedGender === gender ? "underline underline-offset-4" : ""
        );
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b backdrop-blur bg-white/80">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <CustomLogo handleClickLogo={clearInput} />

                    {/* Navigation - Desktop */}
                    <nav className="hidden md:flex items-center space-x-8" onClick={clearInput}>
                        <Link to="/" className={selectNavigation(undefined)}>
                            Todos
                        </Link>
                        <Link to="/gender/men" className={selectNavigation("men")}>
                            Hombres
                        </Link>
                        <Link to="/gender/women" className={selectNavigation("women")}>
                            Mujeres
                        </Link>
                        <Link to="/gender/kid" className={selectNavigation("kid")}>
                            Niños
                        </Link>
                    </nav>

                    {/* Search and Cart */}
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex items-center space-x-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    ref={inputRef}
                                    placeholder="Buscar productos..."
                                    className="pl-9 w-64 h-9 bg-white"
                                    onKeyDown={handleSearch}
                                    defaultValue={query}
                                />
                            </div>
                        </div>

                        {/* Search */}
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Search className="h-5 w-5" />
                        </Button>

                        {/* Login, Logout y Admin Buttons */}
                        {authStatus === "not-authenticated" ? (
                            <Link to="/auth/login" onClick={() => window.scrollTo(0, 0)}>
                                <Button variant="default" size="sm" className="ml-1">
                                    Login
                                </Button>
                            </Link>
                        ) : (
                            <Button variant="default" size="sm" className="ml-1" onClick={logout}>
                                Logout
                            </Button>
                        )}

                        {isAdmin() && (
                            <Link to="/admin" onClick={() => window.scrollTo(0, 0)}>
                                <Button variant="destructive" size="sm" className="ml-1">
                                    Admin
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
