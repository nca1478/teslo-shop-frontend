import { useAuthStore } from "@/auth/store/auth.store";
import { useQuery } from "@tanstack/react-query";

export const useCheckAuth = () => {
    const { checkAuthStatus } = useAuthStore();

    return useQuery({
        queryKey: ["auth"],
        queryFn: checkAuthStatus,
        retry: false,
        refetchInterval: 1000 * 60 * 1.5,
        refetchOnWindowFocus: true,
    });
};
