"use client";

import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import clsx from "clsx";
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from "@/utils";

export const PlaceOrder = () => {
    const [loaded, setLoaded] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const cart = useCartStore((store) => store.cart);
    const address = useAddressStore((state) => state.address);
    const { itemsInCart, subTotal, tax, total } = useCartStore(
        useShallow((state) => state.getSummaryInformation())
    );

    const onPlaceOrder = async () => {
        setIsPlacingOrder(true);
        // await sleep(2);

        const productsToOrder = cart.map((product) => ({
            productId: product.id,
            quantity: product.quantity,
            size: product.size,
        }));

        console.log({ address, productsToOrder });

        setIsPlacingOrder(false);
    };

    useEffect(() => {
        setLoaded(true);
    }, []);

    if (!loaded) {
        <p>Loading...</p>;
    }

    return (
        <div className="bg-white rounded-xl shadow-xl p-7">
            {/* Dirección de Entrega */}
            <h2 className="text-2xl mb-2">Dirección de entrega</h2>
            <div className="mb-10">
                <p className="text-xl">
                    {address.firstName} {address.lastName}
                </p>
                <p>{address.address}</p>
                <p>{address?.address2}</p>
                <p>{address.postalCode}</p>
                <p>
                    {address.city}, {address.country}
                </p>
                <p>{address.phone}</p>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            {/* Resumen de la Orden */}
            <h2 className="text-2xl mb-2">Resumen de orden</h2>
            <div className="grid grid-cols-2">
                <span>Cantidad</span>
                <span className="text-right">
                    {itemsInCart === 1 ? "1 artículo" : `${itemsInCart} artículos`}
                </span>

                <span>Subtotal</span>
                <span className="text-right">{currencyFormat(subTotal)}</span>

                <span>Impuestos (15%)</span>
                <span className="text-right">{currencyFormat(tax)}</span>

                <span className="mt-5 text-2xl">Total:</span>
                <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
            </div>

            <div className="mt-5 mb-2 w-full">
                {/* Disclaimer */}
                <p className="mb-5">
                    <span className="text-xs">
                        Al hacer clic en &quot;Colocar orden&quot;, aceptas nuestros{" "}
                        <a href="#" className="underline">
                            términos y condiciones{" "}
                        </a>
                        y{" "}
                        <a href="#" className="underline">
                            política de privacidad
                        </a>
                    </span>
                </p>

                <button
                    //href="/orders/123"
                    onClick={onPlaceOrder}
                    className={clsx({
                        "btn-primary": !isPlacingOrder,
                        "btn-disabled": isPlacingOrder,
                    })}
                >
                    Colocar orden
                </button>
            </div>
        </div>
    );
};
