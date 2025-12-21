"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";
import { useCartStore, useUIStore } from "@/store";
import { titleFont } from "@/config/fonts/fonts";
import { SearchInput } from "@/components";

export const TopMenu = () => {
    const openSideMenu = useUIStore((state) => state.openSideMenu);
    const totalItemsInCart = useCartStore((state) => state.getTotalItems());
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

    return (
        <nav className="sticky top-0 bg-white/95 backdrop-blur-sm z-40 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 flex justify-between items-center min-h-[60px]">
                {/* Logo */}
                <div className="shrink-0">
                    <Link
                        href="/"
                        className="block p-2 rounded-md transition-all hover:bg-gray-100"
                    >
                        <span
                            className={`${titleFont.className} antialiased font-bold text-lg sm:text-xl`}
                        >
                            Teslo
                        </span>
                        <span className="text-sm sm:text-base"> | Shop</span>
                    </Link>
                </div>

                {/* Center Menu - Hidden on mobile and small tablets */}
                <div className="hidden lg:flex flex-1 justify-center max-w-md">
                    <div className="flex space-x-1">
                        <Link
                            href="/gender/men"
                            className="px-3 py-2 text-sm font-medium rounded-md transition-all hover:bg-gray-100 whitespace-nowrap"
                        >
                            Hombres
                        </Link>
                        <Link
                            href="/gender/women"
                            className="px-3 py-2 text-sm font-medium rounded-md transition-all hover:bg-gray-100 whitespace-nowrap"
                        >
                            Mujeres
                        </Link>
                        <Link
                            href="/gender/kids"
                            className="px-3 py-2 text-sm font-medium rounded-md transition-all hover:bg-gray-100 whitespace-nowrap"
                        >
                            Niños
                        </Link>
                        <Link
                            href="/gender/unisex"
                            className="px-3 py-2 text-sm font-medium rounded-md transition-all hover:bg-gray-100 whitespace-nowrap"
                        >
                            Unisex
                        </Link>
                    </div>
                </div>

                {/* Search, Cart, Menu */}
                <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
                    <SearchInput />

                    {/* Cart with responsive badge */}
                    {loaded && totalItemsInCart > 0 ? (
                        <Link
                            href="/cart"
                            className="p-2 rounded-md transition-all hover:bg-gray-100"
                            aria-label={`Carrito con ${totalItemsInCart} productos`}
                        >
                            <div className="relative">
                                <span className="fade-in absolute text-xs rounded-full px-1.5 py-0.5 font-bold -top-1 -right-1 bg-blue-700 text-white min-w-[18px] text-center leading-none">
                                    {totalItemsInCart > 99 ? "99+" : totalItemsInCart}
                                </span>
                                <IoCartOutline className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                        </Link>
                    ) : (
                        <button
                            className="p-2 rounded-md cursor-not-allowed opacity-50"
                            disabled
                            aria-label="Carrito vacío"
                        >
                            <IoCartOutline className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    )}

                    {/* Menu button with responsive text */}
                    <button
                        className="p-2 rounded-md transition-all hover:bg-gray-100 cursor-pointer flex items-center space-x-1"
                        onClick={openSideMenu}
                        aria-label="Abrir menú"
                    >
                        <span className="text-sm sm:text-base font-medium">Menú</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};
