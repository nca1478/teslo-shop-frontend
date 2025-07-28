export const revalidate = 10080; // 7 días | ojo: no funciona

import { getProductBySlug } from "@/actions";
import {
    ProductMobileSlideshow,
    ProductSlideshow,
    QuantitySelector,
    SizeSelector,
} from "@/components";
import { titleFont } from "@/config/fonts";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function ProductBySlugPage({ params }: Props) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    return (
        <div className="mt-5 mb-20 grid md:grid-cols-3 gap-3">
            <div className="col-span-1 md:col-span-2">
                {/* Mobile Slideshow */}
                <ProductMobileSlideshow
                    title={product.title}
                    images={product.images}
                    className="block md:hidden"
                />

                {/* Desktop Slideshow */}
                <ProductSlideshow
                    title={product.title}
                    images={product.images}
                    className="hidden md:block"
                />
            </div>

            {/* Detalles */}
            <div className="col-span-1 px-5">
                {/* Titulo */}
                <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
                    {product.title}
                </h1>

                {/* Precio */}
                <p className="text-lg mb-5">${product.price}</p>

                {/* Selector de Tallas */}
                <SizeSelector selectedSize={product.sizes[0]} availableSizes={product.sizes} />

                {/* Selector de Cantidad */}
                <QuantitySelector quantity={2} />

                {/* Button */}
                <button className="btn-primary my-5">Agregar al carrito</button>

                {/* Descripción */}
                <h3 className="font-bold text-sm">Descripción</h3>
                <p className="font-light">{product.description}</p>
            </div>
        </div>
    );
}
