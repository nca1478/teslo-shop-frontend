"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";

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
                        <span>
                            {product.title} - <span>{`(${product.size})`}</span>
                        </span>

                        {/* Precio */}
                        <p className="font-bold">
                            ${product.price} x {product.quantity} ={" "}
                            {currencyFormat(product.price * product.quantity)}
                        </p>
                    </div>
                </div>
            ))}
        </>
    );
};
