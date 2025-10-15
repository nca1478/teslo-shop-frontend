import { useParams } from "react-router";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomJumbotron } from "@/shop/components/CustomJumbotron";
import { ProductsGrid } from "@/shop/components/ProductsGrid";
import { useProducts } from "@/shop/hooks/useProducts";

export const GenderPage = () => {
    const { gender } = useParams();
    const genderLabel = gender === "men" ? "Hombres" : gender === "women" ? "Mujeres" : "Niños";

    const { data } = useProducts();

    return (
        <>
            <CustomJumbotron title={`Productos para ${genderLabel}`} />

            <ProductsGrid products={data?.products || []} />

            <CustomPagination totalPages={data?.pages || 0} />
        </>
    );
};
