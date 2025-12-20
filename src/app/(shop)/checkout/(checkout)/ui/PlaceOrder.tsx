"use client";

import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { useRouter } from "next/navigation";
import clsx from "clsx";

import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import { placeOrder } from "@/actions";

export const PlaceOrder = () => {
    const router = useRouter();
    const [loaded, setLoaded] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>("");

    const cart = useCartStore((store) => store.cart);
    const clearCart = useCartStore((store) => store.clearCart);
    const { itemsInCart, subTotal, tax, total } = useCartStore(
        useShallow((state) => state.getSummaryInformation())
    );

    const address = useAddressStore((state) => state.address);
    const removeCurrentAddress = useAddressStore((store) => store.removeCurrentAddress);

    const onPlaceOrder = async () => {
        setIsPlacingOrder(true);
        // await sleep(2);

        const productsToOrder = cart.map((product) => ({
            productId: product.id,
            quantity: product.quantity,
            size: product.size,
        }));

        const resp = await placeOrder(productsToOrder, address);
        if (!resp.ok) {
            setIsPlacingOrder(false);
            setErrorMessage(resp.message);
            return;
        }

        // Salio todo bien - limpiar stores
        clearCart();
        removeCurrentAddress();

        // ir a la vista de orden final
        router.replace("/orders/" + resp.order!.id);
    };

    useEffect(() => {
        setLoaded(true);
    }, []);

    if (!loaded) {
        return <p>Loading...</p>;
    }

    return (
        <div className="space-y-6">
            {/* Dirección de Entrega */}
            <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                    Dirección de entrega
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                    <p className="font-medium text-gray-900">
                        {address.firstName} {address.lastName}
                    </p>
                    <p className="text-gray-700">{address.address}</p>
                    {address?.address2 && <p className="text-gray-700">{address.address2}</p>}
                    <p className="text-gray-700">{address.postalCode}</p>
                    <p className="text-gray-700">
                        {address.city}, {address.country}
                    </p>
                    <p className="text-gray-700">{address.phone}</p>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Resumen de la Orden */}
            <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                    Resumen de orden
                </h2>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Cantidad</span>
                        <span className="font-medium">
                            {itemsInCart === 1 ? "1 artículo" : `${itemsInCart} artículos`}
                        </span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">{currencyFormat(subTotal)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Impuestos (15%)</span>
                        <span className="font-medium">{currencyFormat(tax)}</span>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between">
                            <span className="text-lg font-semibold text-gray-900">Total:</span>
                            <span className="text-lg font-bold text-gray-900">
                                {currencyFormat(total)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botón y términos */}
            <div className="space-y-4">
                {/* Disclaimer */}
                <div className="text-xs text-gray-500 leading-relaxed">
                    <p>
                        Al hacer clic en &quot;Colocar orden&quot;, aceptas nuestros{" "}
                        <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                            términos y condiciones
                        </a>{" "}
                        y{" "}
                        <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                            política de privacidad
                        </a>
                    </p>
                </div>

                {/* Error message */}
                {errorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-800 text-sm font-medium">{errorMessage}</p>
                    </div>
                )}

                {/* Botón de orden */}
                <button
                    onClick={onPlaceOrder}
                    disabled={isPlacingOrder}
                    className={clsx(
                        "w-full py-3 px-6 rounded-lg font-medium transition-all duration-200",
                        {
                            "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-sm":
                                !isPlacingOrder,
                            "bg-gray-300 text-gray-500 cursor-not-allowed": isPlacingOrder,
                        }
                    )}
                >
                    {isPlacingOrder ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Procesando...
                        </div>
                    ) : (
                        "Colocar orden"
                    )}
                </button>

                {/* Información adicional */}
                <div className="text-xs text-gray-500 text-center space-y-1">
                    <p>✓ Envío gratuito en pedidos superiores a $50</p>
                    <p>✓ Garantía de devolución de 30 días</p>
                </div>
            </div>
        </div>
    );
};
