import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductByIdAction } from "../actions/get-product-by-id.action";
import { createUpdateProductAction } from "../actions/create-update-product.action";
import type { Product } from "@/interfaces/product.interface";

export const useProduct = (id: string) => {
    // Cliente de caché de React Query para invalidar y actualizar queries
    const queryClient = useQueryClient();

    const query = useQuery({
        // queryKey: ["product", { id }],
        queryKey: ["products", { id }],
        queryFn: () => getProductByIdAction(id),
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutos
        // enabled: !!id
    });

    // Mutación para crear o actualizar un producto en el backend.
    const mutation = useMutation({
        mutationFn: createUpdateProductAction,

        // Al completar con éxito la creación/actualización:
        onSuccess: (product: Product) => {
            // Actualización directa del caché del producto editado
            queryClient.setQueryData(["products", { id: product.id }], product);

            // Actualizar el caché de la lista de productos de forma optimista
            queryClient.setQueriesData({ queryKey: ["products"], exact: false }, (oldData: any) => {
                if (!oldData?.products) return oldData;

                const updatedProducts = oldData.products.map((p: Product) =>
                    p.id === product.id ? product : p
                );

                return {
                    ...oldData,
                    products: updatedProducts,
                };
            });

            // Como respaldo, invalidamos las queries para asegurar consistencia
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    return {
        ...query,
        mutation,
    };
};
