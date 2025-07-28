"use client";

import { QuantitySelector, SizeSelector } from "@/components";
import { Product, Size } from "@/interfaces";
import { useState } from "react";

interface Props {
    product: Product;
}

export const AddToCart = ({ product }: Props) => {
    const [size, setSize] = useState<Size | undefined>();
    const [quantity, setQuantity] = useState(1);
    const [posted, setPosted] = useState(false);

    const addToCart = () => {
        setPosted(true);

        if (!size) return;

        console.log({ object: "addToCart", slug: product.slug, size, quantity });
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
