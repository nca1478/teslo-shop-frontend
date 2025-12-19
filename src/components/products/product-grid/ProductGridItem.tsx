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

    // Dar prioridad a las primeras 8 imágenes (2 filas en móvil, 1 fila en desktop)
    const shouldPrioritize = index < 8;

    return (
        <div className="group rounded-lg overflow-hidden fade-in bg-white shadow-sm hover:shadow-md transition-all duration-300">
            <Link href={`/product/${product.slug}`} className="block">
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <ProductImage
                        src={displayImage}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        width={400}
                        height={400}
                        onMouseEnter={() => setDisplayImage(secondaryImage)}
                        onMouseLeave={() => setDisplayImage(primaryImage)}
                        priority={shouldPrioritize}
                    />
                </div>
            </Link>

            <div className="p-3 sm:p-4">
                <Link
                    className="block hover:text-blue-600 transition-colors duration-200"
                    href={`/product/${product.slug}`}
                >
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2 mb-1">
                        {product.title}
                    </h3>
                </Link>
                <p className="text-lg sm:text-xl font-bold text-gray-900">${product.price}</p>
            </div>
        </div>
    );
};
