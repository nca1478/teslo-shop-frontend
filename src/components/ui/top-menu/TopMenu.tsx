"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { titleFont } from "@/config/fonts";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";
import { useCartStore, useUIStore } from "@/store";

export const TopMenu = () => {
    const openSideMenu = useUIStore((state) => state.openSideMenu);
    const totalItemsInCart = useCartStore((state) => state.getTotalItems());
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

    return (
        <nav className="flex px-5 justify-between items-center w-full">
            {/* Logo */}
            <div className="m-2 p-2 rounded-md transition-all hover:bg-gray-100">
                <Link href="/">
                    <span className={`${titleFont.className} antialiased font-bold`}>Teslo</span>
                    <span> | Shop</span>
                </Link>
            </div>

            {/* Center Menu */}
            <div className="hidden sm:block">
                <Link
                    href="/gender/men"
                    className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
                >
                    Hombres
                </Link>
                <Link
                    href="/gender/women"
                    className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
                >
                    Mujeres
                </Link>
                <Link
                    href="/gender/kids"
                    className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
                >
                    Niños
                </Link>
            </div>

            {/* Search, Cart, Menu */}
            <div className="flex items-center">
                <Link href="/search" className="mx-2">
                    <IoSearchOutline className="w-5 h-5" />
                </Link>

                <Link href="/cart" className="mx-2">
                    <div className="relative">
                        {loaded && totalItemsInCart > 0 && (
                            <span className="fade-in absolute text-xs rounded-full px-1 font-bold -top-2 -right-3 bg-blue-700 text-white">
                                {totalItemsInCart}
                            </span>
                        )}
                        <IoCartOutline className="w-5 h-5" />
                    </div>
                </Link>

                {/* Abrir menu */}
                <button
                    className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
                    onClick={openSideMenu}
                >
                    Menú
                </button>
            </div>
        </nav>
    );
};
