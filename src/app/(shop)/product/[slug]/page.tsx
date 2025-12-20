export const revalidate = 10080; // 7 días | ojo: no funciona

import { getProductBySlug } from "@/actions";
import { ProductMobileSlideshow, ProductSlideshow, StockLabel } from "@/components";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCart } from "./ui/AddToCart";
import { titleFont } from "@/config/fonts/fonts";

interface Props {
    params: Promise<{ slug: string }>;
}

// Generar Metadata - Etiquetas para el SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    return {
        title: product?.title ?? "Producto no encontrado",
        description: product?.description ?? "",
        openGraph: {
            title: product?.title ?? "Producto no encontrado",
            description: product?.description ?? "",
            images: [`/products/${product?.images[1]}`],
        },
    };
}

export default async function ProductBySlugPage({ params }: Props) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Imágenes del producto */}
            <div className="space-y-4">
                {/* Mobile Slideshow */}
                <ProductMobileSlideshow
                    title={product.title}
                    images={product.images}
                    className="block lg:hidden"
                />

                {/* Desktop Slideshow */}
                <ProductSlideshow
                    title={product.title}
                    images={product.images}
                    className="hidden lg:block"
                />
            </div>

            {/* Detalles del producto */}
            <div className="space-y-6">
                <div>
                    {/* Titulo */}
                    <h1
                        className={`${titleFont.className} antialiased font-bold text-2xl sm:text-3xl lg:text-4xl text-gray-900 leading-tight`}
                    >
                        {product.title}
                    </h1>

                    {/* Precio */}
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4">
                        ${product.price}
                    </p>
                </div>

                {/* Stock */}
                <div>
                    <StockLabel slug={product.slug} />
                </div>

                {/* Agregar al carrito - client side */}
                <div className="bg-white shadow-sm hover:shadow-md transition-all duration-300 rounded-lg p-4 sm:p-6">
                    <AddToCart product={product} />
                </div>

                {/* Descripción */}
                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Descripción del producto
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
            </div>
        </div>
    );
}
