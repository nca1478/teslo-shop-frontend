import { CustomPagination } from "@/components/custom/CustomPagination";
import { products } from "@/mocks/products.mock";
import { CustomJumbotron } from "@/shop/components/CustomJumbotron";
import { ProductsGrid } from "@/shop/components/ProductsGrid";
import { useProducts } from "@/shop/hooks/useProducts";

export const HomePage = () => {
    const { data } = useProducts();

    return (
        <>
            <CustomJumbotron title="Todos los Productos" />

            <ProductsGrid products={products} />

            <CustomPagination totalPages={7} />
        </>
    );
};
