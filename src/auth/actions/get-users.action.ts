import { tesloApi } from "@/api/tesloApi";
import type { UsersResponse } from "@/interfaces/users.response";

interface Options {
    limit?: number | string;
    offset?: number | string;
    isActive?: boolean;
    query?: string;
    role?: string;
}

export const getUsersAction = async (options: Options = {}): Promise<UsersResponse> => {
    const { limit, offset, isActive, query, role } = options;

    const { data } = await tesloApi.get<UsersResponse>("/auth/users", {
        params: {
            limit,
            offset,
            isActive,
            role,
            q: query,
        },
    });

    return data;
};
