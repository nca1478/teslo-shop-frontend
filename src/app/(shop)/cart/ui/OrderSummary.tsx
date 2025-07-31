"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store";
import { useShallow } from "zustand/shallow";
import Link from "next/link";

export const OrderSummary = () => {
    // alternativa #1, al seleccionar el cart, este se vuelve a renderizar
    // useCartStore((state) => state.cart);

    // alternativa #2, useShallow: se suscribe al state calculado sin renderizar (hook de zustand)
    const { itemsInCart, subTotal, tax, total } = useCartStore(
        useShallow((state) => state.getSummaryInformation())
    );

    const [loaded, setloaded] = useState(false);

    useEffect(() => {
        setloaded(true);
    }, []);

    if (!loaded) {
        return <p>Loading...</p>;
    }

    return (
        <>
            {/* Resumen de la orden */}
            <div className="grid grid-cols-2">
                <span>Cantidad</span>
                <span className="text-right">
                    {itemsInCart === 1 ? "1 artículo" : `${itemsInCart} artículos`}
                </span>

                <span>Subtotal</span>
                <span className="text-right">{subTotal}</span>

                <span>Impuestos (15%)</span>
                <span className="text-right">{tax}</span>

                <span className="mt-5 text-2xl">Total:</span>
                <span className="mt-5 text-2xl text-right">{total}</span>
            </div>

            {/* Botón de siguiente */}
            <div className="mt-5 mb-2 w-full">
                {itemsInCart > 0 ? (
                    <Link className="flex btn-primary justify-center" href="/checkout/address">
                        Siguiente
                    </Link>
                ) : (
                    <button
                        className="flex w-full btn-disabled cursor-not-allowed justify-center"
                        disabled
                    >
                        Siguiente
                    </button>
                )}
            </div>
        </>
    );
};
