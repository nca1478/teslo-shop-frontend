import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getProductsAction } from "../actions/get-products.action";

export const useProducts = () => {
    const [searchParams] = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 9;
    const offset = (page - 1) * limit;

    return useQuery({
        queryKey: ["products", { limit, offset }],
        queryFn: () => getProductsAction({ limit, offset }),
        staleTime: 1000 * 60 * 5,
    });
};
