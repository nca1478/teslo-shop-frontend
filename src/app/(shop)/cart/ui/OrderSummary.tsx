"use client";

import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import Link from "next/link";
import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";

export const OrderSummary = () => {
    // alternativa #2, useShallow: se suscribe al state calculado sin renderizar (hook de zustand)
    const { itemsInCart, subTotal, tax, total } = useCartStore(
        useShallow((state) => state.getSummaryInformation())
    );

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

    if (!loaded) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Resumen de la orden */}
            <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Cantidad</span>
                    <span className="font-medium text-gray-900">
                        {itemsInCart === 1 ? "1 artículo" : `${itemsInCart} artículos`}
                    </span>
                </div>

                <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">{currencyFormat(subTotal)}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Impuestos (15%)</span>
                    <span className="font-medium text-gray-900">{currencyFormat(tax)}</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total:</span>
                        <span className="text-xl font-bold text-gray-900">
                            {currencyFormat(total)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Botones de siguiente y checkout */}
            <div className="space-y-3">
                {itemsInCart > 0 ? (
                    <Link
                        className="w-full btn-primary flex items-center justify-center py-3 text-base font-medium"
                        href="/checkout/address"
                    >
                        Proceder al Checkout
                    </Link>
                ) : (
                    <button
                        className="w-full btn-disabled flex items-center justify-center py-3 text-base font-medium"
                        disabled
                    >
                        Carrito vacío
                    </button>
                )}

                <p className="text-xs text-gray-500 text-center">
                    Envío gratuito en pedidos superiores a $50
                </p>
            </div>
        </div>
    );
};
