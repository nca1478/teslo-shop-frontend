import { Product } from "@/interfaces";
import { ProductGridItem } from "./ProductGridItem";

interface Props {
    products: Product[];
}

export const ProductGrid = ({ products }: Props) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-10">
            {products.map((product, index) => (
                <ProductGridItem key={product.slug} product={product} index={index} />
            ))}
        </div>
    );
};
