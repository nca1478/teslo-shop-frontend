import { useParams, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getProductsAction } from "../actions/get-products.action";

export const useProducts = () => {
    const { gender } = useParams();
    const [searchParams] = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 9;
    const sizes = searchParams.get("sizes") || "";

    const offset = (page - 1) * limit;

    return useQuery({
        queryKey: ["products", { limit, offset, gender, sizes }],
        queryFn: () => getProductsAction({ limit, offset, gender, sizes }),
        staleTime: 1000 * 60 * 5,
    });
};
