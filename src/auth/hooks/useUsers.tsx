import { useQuery } from "@tanstack/react-query";
import { getUsersAction } from "@/auth/actions/get-users.action";

export const useUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: () => getUsersAction(),
        retry: false,
    });
};
