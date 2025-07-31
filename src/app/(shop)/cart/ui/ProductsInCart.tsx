"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { QuantitySelector } from "@/components";
import { useCartStore } from "@/store";
import Link from "next/link";

export const ProductsInCart = () => {
    const productsInCart = useCartStore((state) => state.cart);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

    if (!loaded) {
        return <p>Loading...</p>;
    }

    return (
        <>
            {productsInCart.map((product) => (
                <div key={`${product.slug}-${product.size}`} className="flex mb-5">
                    {/* Imagen del Producto */}
                    <Image
                        src={`/products/${product.image}`}
                        width={100}
                        height={100}
                        style={{
                            width: "100px",
                            height: "100px",
                        }}
                        alt={product.title}
                        className="mr-5 rounded"
                    />

                    <div>
                        {/* Nombre Producto */}
                        <Link
                            className="hover:underline cursor-pointer"
                            href={`/product/${product.slug}`}
                        >
                            {product.title} - <span>{`(${product.size})`}</span>
                        </Link>

                        {/* Precio */}
                        <p>${product.price}</p>
                        <QuantitySelector
                            quantity={3}
                            onQuantityChanged={(value) => console.log(value)}
                        />

                        <button className="underline mt-3">Remover</button>
                    </div>
                </div>
            ))}
        </>
    );
};
