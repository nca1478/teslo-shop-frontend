import { useQuery } from "@tanstack/react-query";
import { getProductsAction } from "../actions/get-products.action";

export const useProducts = () => {
    return useQuery({
        queryKey: ["products"],
        queryFn: getProductsAction,
    });
};
