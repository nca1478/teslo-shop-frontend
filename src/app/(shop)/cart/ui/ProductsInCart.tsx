"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductImage, QuantitySelector } from "@/components";
import { useCartStore } from "@/store";

export const ProductsInCart = () => {
    const productsInCart = useCartStore((state) => state.cart);
    const updateProductQuantity = useCartStore((state) => state.updateProductQuantity);
    const removeProduct = useCartStore((state) => state.removeProduct);
    const [loaded, setLoaded] = useState(false);

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
                <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
                <Link
                    href="/"
                    className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Explorar productos
                </Link>
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
                            width={120}
                            height={120}
                            alt={product.title}
                            className="rounded-lg object-cover w-24 h-24 sm:w-30 sm:h-30"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        {/* Información del producto */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                            <div className="flex-1">
                                <Link
                                    className="text-gray-900 hover:text-blue-600 transition-colors font-medium text-sm sm:text-base line-clamp-2"
                                    href={`/product/${product.slug}`}
                                >
                                    {product.title}
                                </Link>
                                <p className="text-gray-600 text-sm mt-1">
                                    Talla: <span className="font-medium">{product.size}</span>
                                </p>
                            </div>

                            <div className="text-right sm:text-left">
                                <p className="text-lg font-bold text-gray-900">${product.price}</p>
                            </div>
                        </div>

                        {/* Controles de cantidad y eliminar */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">Cantidad:</span>
                                <QuantitySelector
                                    quantity={product.quantity}
                                    onQuantityChanged={(quantity) =>
                                        updateProductQuantity(product, quantity)
                                    }
                                    showLabel={false}
                                    size="sm"
                                />
                            </div>

                            <button
                                className="text-red-600 hover:text-red-800 text-sm font-medium underline transition-colors self-start sm:self-auto"
                                onClick={() => removeProduct(product)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
