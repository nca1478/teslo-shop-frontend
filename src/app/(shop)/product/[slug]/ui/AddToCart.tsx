"use client";

import { useState } from "react";
import { useCartStore } from "@/store";
import { QuantitySelector, SizeSelector } from "@/components";
import { CartProduct, Product, Size } from "@/interfaces";

interface Props {
    product: Product;
}

export const AddToCart = ({ product }: Props) => {
    const addProductToCart = useCartStore((state) => state.addProductToCart);
    const [size, setSize] = useState<Size | undefined>();
    const [quantity, setQuantity] = useState(1);
    const [posted, setPosted] = useState(false);

    // Verificar si hay stock disponible
    const stockAmount = product.inStock ?? 0;
    const isOutOfStock = stockAmount === 0;
    const hasLowStock = stockAmount > 0 && stockAmount <= 5;

    const addToCart = () => {
        setPosted(true);

        if (!size || isOutOfStock) return;

        const cartProduct: CartProduct = {
            id: product.id,
            slug: product.slug,
            title: product.title,
            price: product.price,
            quantity: quantity,
            size: size,
            image: product.images[0],
        };

        addProductToCart(cartProduct);

        setPosted(false);
        setQuantity(1);
        setSize(undefined);
    };

    return (
        <div className="space-y-4">
            {/* Mensaje de stock */}
            {isOutOfStock && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-800 font-medium text-sm">
                        ⚠️ Producto agotado - No disponible para compra
                    </p>
                </div>
            )}

            {hasLowStock && !isOutOfStock && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-yellow-800 font-medium text-sm">
                        ⚡ ¡Últimas {stockAmount} unidades disponibles!
                    </p>
                </div>
            )}

            {/* Mostrar error si no hay talla seleccionada */}
            {posted && !size && !isOutOfStock && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <span className="text-red-800 font-medium text-sm fade-in">
                        ⚠️ Debe seleccionar una talla
                    </span>
                </div>
            )}

            {/* Selector de Tallas */}
            <div>
                <SizeSelector
                    selectedSize={size}
                    availableSizes={product.sizes as Size[]}
                    onSizeChanged={setSize}
                    disabled={isOutOfStock}
                />
            </div>

            {/* Selector de Cantidad */}
            {!isOutOfStock && (
                <div>
                    <QuantitySelector
                        quantity={quantity}
                        onQuantityChanged={setQuantity}
                        showLabel={true}
                        size="md"
                    />
                </div>
            )}

            {/* Button */}
            <div>
                <button
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                        isOutOfStock
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "btn-primary hover:scale-105 active:scale-95"
                    }`}
                    onClick={addToCart}
                    disabled={isOutOfStock}
                    title={isOutOfStock ? "Producto sin stock" : "Agregar al carrito"}
                >
                    {isOutOfStock ? "Sin stock disponible" : "Agregar al carrito"}
                </button>
            </div>

            {/* Información adicional */}
            {!isOutOfStock && (
                <div className="text-xs text-gray-500 text-center">
                    <p>✓ Envío gratuito en pedidos superiores a $50</p>
                    <p>✓ Devoluciones gratuitas dentro de 30 días</p>
                </div>
            )}
        </div>
    );
};
