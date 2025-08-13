"use client";

import clsx from "clsx";
import Link from "next/link";
import {
    IoCloseOutline,
    IoLogInOutline,
    IoLogOutOutline,
    IoPeopleOutline,
    IoPersonOutline,
    IoSearchOutline,
    IoShirtOutline,
    IoTicketOutline,
} from "react-icons/io5";
import { useSession, signOut } from "next-auth/react";
import { useUIStore } from "@/store";
import { logout } from "@/actions";

export const Sidebar = () => {
    const { data: session } = useSession();

    const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
    const closeSideMenu = useUIStore((state) => state.closeSideMenu);

    const isAuthenticated = !!session?.user;
    const isAdmin = session?.user.role === "admin";

    const handleLogout = () => {
        logout();
        signOut({ callbackUrl: "/" }); // logout client side, hace re-render del componente
        closeSideMenu();
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
                    "overflow-auto fixed p-5 right-0 top-0 w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
                    {
                        "translate-x-full": !isSideMenuOpen,
                    }
                )}
            >
                {/* Close menu button */}
                <IoCloseOutline
                    size={50}
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={closeSideMenu}
                />

                {/* Input */}
                <div className="relative mt-14">
                    <IoSearchOutline size={20} className="absolute top-2 left-2" />
                    <input
                        type="text"
                        placeholder="Buscar"
                        className="w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* Menú */}

                {/* Role: User y Admin */}
                {isAuthenticated && (
                    <>
                        {/* Perfil */}
                        <Link
                            href="/profile"
                            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                            onClick={closeSideMenu}
                        >
                            <IoPersonOutline size={30} />
                            <span className="ml-3 text-xl">Perfil</span>
                        </Link>

                        {/* Orders */}
                        <Link
                            href="/orders"
                            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                            onClick={closeSideMenu}
                        >
                            <IoTicketOutline size={30} />
                            <span className="ml-3 text-xl">Ordenes</span>
                        </Link>
                    </>
                )}

                {/* Ingresar - Iniciar Sesión */}
                {!isAuthenticated && (
                    <Link
                        href="/auth/login"
                        className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                        onClick={closeSideMenu}
                    >
                        <IoLogInOutline size={30} />
                        <span className="ml-3 text-xl">Ingresar</span>
                    </Link>
                )}

                {/* Salir - Cerrar Sesión */}
                {isAuthenticated && (
                    <button
                        className="w-full flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all cursor-pointer"
                        onClick={handleLogout}
                    >
                        <IoLogOutOutline size={30} />
                        <span className="ml-3 text-xl">Salir</span>
                    </button>
                )}

                {/* Role: Admin */}
                {isAdmin && (
                    <>
                        {/* Line Separator */}
                        <div className="w-full h-px bg-gray-200 my-10" />

                        {/* Productos */}
                        <Link
                            href="/"
                            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                        >
                            <IoShirtOutline size={30} />
                            <span className="ml-3 text-xl">Productos</span>
                        </Link>

                        {/* Ordenes */}
                        <Link
                            href="/"
                            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                        >
                            <IoTicketOutline size={30} />
                            <span className="ml-3 text-xl">Ordenes</span>
                        </Link>

                        {/* Usuarios */}
                        <Link
                            href="/"
                            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                        >
                            <IoPeopleOutline size={30} />
                            <span className="ml-3 text-xl">Usuarios</span>
                        </Link>
                    </>
                )}
            </nav>
        </div>
    );
};
