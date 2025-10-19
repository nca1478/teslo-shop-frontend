import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { getProductsAction } from "@/shop/actions/get-products.action";

export const useAdminProducts = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query") || "";

    return useQuery({
        queryKey: ["products", { limit: 50, offset: 0, query }],
        queryFn: () => getProductsAction({ limit: 50, offset: 0, query }),
        staleTime: 0, // Siempre considerar los datos como stale en admin
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });
};
