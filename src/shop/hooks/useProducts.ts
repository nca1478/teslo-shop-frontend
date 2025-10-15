import { useParams, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getProductsAction } from "../actions/get-products.action";

export const useProducts = () => {
    const { gender } = useParams();
    const [searchParams] = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 9;
    const sizes = searchParams.get("sizes") || undefined;
    const price = searchParams.get("price") || "any";
    const offset = (page - 1) * limit;

    let minPrice: number | undefined;
    let maxPrice: number | undefined;

    switch (price) {
        case "any":
            break;

        case "0-50":
            minPrice = 0;
            maxPrice = 50;
            break;

        case "100-200":
            minPrice = 100;
            maxPrice = 200;
            break;

        case "200+":
            minPrice = 200;
            maxPrice = undefined;
            break;
    }

    return useQuery({
        queryKey: ["products", { limit, offset, gender, sizes, minPrice, maxPrice }],
        queryFn: () => getProductsAction({ limit, offset, gender, sizes, minPrice, maxPrice }),
        staleTime: 1000 * 60 * 5,
    });
};
