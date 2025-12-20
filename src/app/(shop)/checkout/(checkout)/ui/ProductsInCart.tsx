"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import { ProductImage } from "@/components";

export const ProductsInCart = () => {
    const [loaded, setLoaded] = useState(false);
    const productsInCart = useCartStore((state) => state.cart);

    useEffect(() => {
        setLoaded(true);
    }, []);

    if (!loaded) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (productsInCart.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No hay productos en el carrito</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {productsInCart.map((product) => (
                <div
                    key={`${product.slug}-${product.size}`}
                    className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                >
                    {/* Imagen del Producto */}
                    <div className="shrink-0 mx-auto sm:mx-0">
                        <ProductImage
                            src={product.image}
                            width={100}
                            height={100}
                            alt={product.title}
                            className="rounded-lg object-cover w-24 h-24 sm:w-25 sm:h-25"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        {/* Información del producto */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <div className="flex-1">
                                <h3 className="text-gray-900 font-medium text-sm sm:text-base line-clamp-2">
                                    {product.title}
                                </h3>
                                <p className="text-gray-600 text-sm mt-1">
                                    Talla: <span className="font-medium">{product.size}</span>
                                </p>
                                <p className="text-gray-600 text-sm">
                                    Cantidad:{" "}
                                    <span className="font-medium">{product.quantity} Und.</span>
                                </p>
                            </div>

                            <div className="text-left sm:text-right">
                                <p className="text-sm text-gray-600">
                                    ${product.price} x {product.quantity}
                                </p>
                                <p className="text-lg font-bold text-gray-900 mt-1">
                                    {currencyFormat(product.price * product.quantity)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
