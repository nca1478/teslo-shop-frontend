"use client";

import clsx from "clsx";
import Link from "next/link";
import {
    IoCloseOutline,
    IoLogInOutline,
    IoLogOutOutline,
    IoPeopleOutline,
    IoPersonOutline,
    IoShirtOutline,
    IoTicketOutline,
} from "react-icons/io5";
import { useAuth } from "@/contexts/AuthContext";
import { useUIStore } from "@/store";
import { useRouter } from "next/navigation";
import { SearchInput } from "@/components";

export const Sidebar = () => {
    const router = useRouter();
    const { user, logout: logoutContext } = useAuth();

    const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
    const closeSideMenu = useUIStore((state) => state.closeSideMenu);

    const isAuthenticated = !!user;
    const isAdmin = user?.roles.includes("admin");

    const handleLogout = async () => {
        try {
            // Actualizar el contexto inmediatamente
            logoutContext();
            closeSideMenu();

            // Llamar a la API para limpiar las cookies del servidor
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Failed to logout");
            }

            // Redirigir al home
            router.push("/");
        } catch (error) {
            console.error("Error during logout:", error);
            // Fallback: redirigir al home de todas formas
            router.push("/");
        }
    };

    return (
        <div>
            {/* Background black */}
            {isSideMenuOpen && (
                <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30" />
            )}

            {/* Blur */}
            {isSideMenuOpen && (
                <div
                    className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
                    onClick={closeSideMenu}
                />
            )}

            {/* Sidemenu */}
            <nav
                className={clsx(
                    "overflow-auto fixed p-4 sm:p-6 right-0 top-0 w-full max-w-sm sm:max-w-md h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
                    {
                        "translate-x-full": !isSideMenuOpen,
                    }
                )}
            >
                {/* Close menu button */}
                <IoCloseOutline
                    size={40}
                    className="absolute top-4 right-4 cursor-pointer hover:bg-gray-100 rounded-full p-1 transition-colors"
                    onClick={closeSideMenu}
                />

                {/* Search Input */}
                <div className="mt-12 sm:mt-14">
                    <SearchInput
                        showInSidebar={true}
                        placeholder="Buscar productos..."
                        className="w-full"
                    />
                </div>

                {/* Navigation Categories - Mobile only */}
                <div className="mt-6 lg:hidden">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Categorías
                    </h3>
                    <div className="space-y-1">
                        <Link
                            href="/gender/men"
                            className="flex items-center py-3 px-3 hover:bg-gray-100 rounded-lg transition-all text-gray-700"
                            onClick={closeSideMenu}
                        >
                            <span className="text-base">Hombres</span>
                        </Link>
                        <Link
                            href="/gender/women"
                            className="flex items-center py-3 px-3 hover:bg-gray-100 rounded-lg transition-all text-gray-700"
                            onClick={closeSideMenu}
                        >
                            <span className="text-base">Mujeres</span>
                        </Link>
                        <Link
                            href="/gender/kids"
                            className="flex items-center py-3 px-3 hover:bg-gray-100 rounded-lg transition-all text-gray-700"
                            onClick={closeSideMenu}
                        >
                            <span className="text-base">Niños</span>
                        </Link>
                        <Link
                            href="/gender/unisex"
                            className="flex items-center py-3 px-3 hover:bg-gray-100 rounded-lg transition-all text-gray-700"
                            onClick={closeSideMenu}
                        >
                            <span className="text-base">Unisex</span>
                        </Link>
                    </div>

                    {/* Separator */}
                    <div className="w-full h-px bg-gray-200 my-6" />
                </div>

                {/* User Menu */}
                <div className="mt-6 lg:mt-10">
                    {/* Role: User y Admin */}
                    {isAuthenticated && (
                        <>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                Mi Cuenta
                            </h3>
                            <div className="space-y-1">
                                {/* Perfil */}
                                <Link
                                    href="/profile"
                                    className="flex items-center py-3 px-3 hover:bg-gray-100 rounded-lg transition-all"
                                    onClick={closeSideMenu}
                                >
                                    <IoPersonOutline size={24} className="text-gray-600" />
                                    <span className="ml-3 text-base">Perfil</span>
                                </Link>

                                {/* Orders */}
                                <Link
                                    href="/orders"
                                    className="flex items-center py-3 px-3 hover:bg-gray-100 rounded-lg transition-all"
                                    onClick={closeSideMenu}
                                >
                                    <IoTicketOutline size={24} className="text-gray-600" />
                                    <span className="ml-3 text-base">Mis Órdenes</span>
                                </Link>
                            </div>
                        </>
                    )}

                    {/* Ingresar - Iniciar Sesión */}
                    {!isAuthenticated && (
                        <Link
                            href="/auth/login"
                            className="flex items-center py-3 px-3 hover:bg-gray-100 rounded-lg transition-all bg-blue-50 border border-blue-200"
                            onClick={closeSideMenu}
                        >
                            <IoLogInOutline size={24} className="text-blue-600" />
                            <span className="ml-3 text-base font-medium text-blue-600">
                                Iniciar Sesión
                            </span>
                        </Link>
                    )}

                    {/* Salir - Cerrar Sesión */}
                    {isAuthenticated && (
                        <button
                            className="w-full flex items-center py-3 px-3 hover:bg-red-50 rounded-lg transition-all cursor-pointer mt-2"
                            onClick={handleLogout}
                        >
                            <IoLogOutOutline size={24} className="text-red-600" />
                            <span className="ml-3 text-base text-red-600">Cerrar Sesión</span>
                        </button>
                    )}

                    {/* Role: Admin */}
                    {isAdmin && (
                        <>
                            {/* Line Separator */}
                            <div className="w-full h-px bg-gray-200 my-6" />

                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                Administración
                            </h3>
                            <div className="space-y-1">
                                {/* Productos */}
                                <Link
                                    href="/admin/products"
                                    className="flex items-center py-3 px-3 hover:bg-gray-100 rounded-lg transition-all"
                                    onClick={closeSideMenu}
                                >
                                    <IoShirtOutline size={24} className="text-gray-600" />
                                    <span className="ml-3 text-base">Productos</span>
                                </Link>

                                {/* Ordenes */}
                                <Link
                                    href="/admin/orders"
                                    className="flex items-center py-3 px-3 hover:bg-gray-100 rounded-lg transition-all"
                                    onClick={closeSideMenu}
                                >
                                    <IoTicketOutline size={24} className="text-gray-600" />
                                    <span className="ml-3 text-base">Órdenes</span>
                                </Link>

                                {/* Usuarios */}
                                <Link
                                    href="/admin/users"
                                    className="flex items-center py-3 px-3 hover:bg-gray-100 rounded-lg transition-all"
                                    onClick={closeSideMenu}
                                >
                                    <IoPeopleOutline size={24} className="text-gray-600" />
                                    <span className="ml-3 text-base">Usuarios</span>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </nav>
        </div>
    );
};
