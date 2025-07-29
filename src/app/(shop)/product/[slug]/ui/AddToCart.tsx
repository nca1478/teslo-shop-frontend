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

    const addToCart = () => {
        setPosted(true);

        if (!size) return;

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
        <>
            {/* Mostrar error si no hay talla seleccionada */}
            {posted && !size && (
                <span className="text-red-500 font-bold fade-in">
                    Debe de seleccionar una talla!
                </span>
            )}

            {/* Selector de Tallas */}
            <SizeSelector
                selectedSize={size}
                availableSizes={product.sizes}
                onSizeChanged={setSize}
            />

            {/* Selector de Cantidad */}
            <QuantitySelector quantity={quantity} onQuantityChanged={setQuantity} />

            {/* Button */}
            <button className="btn-primary my-5" onClick={addToCart}>
                Agregar al carrito
            </button>
        </>
    );
};
