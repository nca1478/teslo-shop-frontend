import { useQuery } from "@tanstack/react-query";
import { getProductsAction } from "@/shop/actions/get-products.action";

export const useAdminProducts = () => {
    return useQuery({
        queryKey: ["products", { limit: 50, offset: 0 }], // Parámetros fijos para admin
        queryFn: () => getProductsAction({ limit: 50, offset: 0 }),
        staleTime: 0, // Siempre considerar los datos como stale en admin
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });
};
