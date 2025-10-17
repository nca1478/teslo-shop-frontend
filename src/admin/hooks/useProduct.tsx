import { useQuery } from "@tanstack/react-query";
import { getProductByIdAction } from "../actions/get-product-by-id.action";
import type { Product } from "@/interfaces/product.interface";

export const useProduct = (id: string) => {
    const query = useQuery({
        queryKey: ["product", { id }],
        queryFn: () => getProductByIdAction(id),
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutos
        // enabled: !!id
    });

    const handleSubmitForm = async (product: Partial<Product>) => {
        console.log({ product });
    };

    return {
        ...query,
        handleSubmitForm,
    };
};
