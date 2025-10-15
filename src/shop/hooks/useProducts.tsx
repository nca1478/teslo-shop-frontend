import { useParams, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getProductsAction } from "../actions/get-products.action";

export const useProducts = () => {
    const { gender } = useParams(); // Obtiene parámetro 'gender' de la URL
    const [searchParams] = useSearchParams(); // Obtiene query parameters de la URL

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 9;
    const offset = (page - 1) * limit;

    const sizes = searchParams.get("sizes") || undefined;
    const query = searchParams.get("query") || undefined;
    const price = searchParams.get("price") || "any";

    let minPrice: number | undefined;
    let maxPrice: number | undefined;

    switch (price) {
        case "any":
            break;

        case "0-50":
            minPrice = 0;
            maxPrice = 50;
            break;

        case "50-100":
            minPrice = 50;
            maxPrice = 100;
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
        queryKey: ["products", { limit, offset, gender, sizes, minPrice, maxPrice, query }],
        queryFn: () =>
            getProductsAction({ limit, offset, gender, sizes, minPrice, maxPrice, query }),
        staleTime: 1000 * 60 * 5,
    });
};
