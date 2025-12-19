"use client";

import Link from "next/link";

import { Product } from "@/interfaces";
import { useState } from "react";
import { ProductImage } from "@/components/product/product-image/ProductImage";

interface Props {
    product: Product;
    index: number;
}

export const ProductGridItem = ({ product, index }: Props) => {
    // Manejar productos sin imágenes usando placeholder
    const primaryImage = product.images.length > 0 ? product.images[0] : "placeholder.png";
    const secondaryImage = product.images.length > 1 ? product.images[1] : primaryImage;

    const [displayImage, setDisplayImage] = useState(primaryImage);

    // Dar prioridad a las primeras 6 imágenes (2 filas en móvil, 1 fila en desktop)
    const shouldPrioritize = index < 6;

    return (
        <div className="rounded-md overflow-hidden fade-in">
            <Link href={`/product/${product.slug}`}>
                <ProductImage
                    src={displayImage}
                    alt={product.title}
                    className="w-full object-cover rounded"
                    width={500}
                    height={500}
                    onMouseEnter={() => setDisplayImage(secondaryImage)}
                    onMouseLeave={() => setDisplayImage(primaryImage)}
                    priority={shouldPrioritize}
                />
            </Link>

            <div className="p-4 flex flex-col">
                <Link className="hover:text-blue-600" href={`/product/${product.slug}`}>
                    {product.title}
                </Link>
                <span className="font-bold">${product.price}</span>
            </div>
        </div>
    );
};
