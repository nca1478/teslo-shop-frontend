import { httpClient } from "../http-client";
import { User as BaseUser } from "@/interfaces";

// User type for API responses (without password for security)
export type User = Omit<BaseUser, "password">;

// Backend API response type (now uses name consistently)
interface ApiUser {
    id: string;
    name: string;
    email: string;
    emailVerified?: Date | null;
    role: string;
    image?: string | null;
}

export interface GetPaginatedUsersRequest {
    page?: number;
    limit?: number;
}

export interface GetPaginatedUsersResponse {
    users: ApiUser[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ChangeUserRoleRequest {
    role: string;
}

export interface ChangeUserRoleResponse {
    message: string;
}

export class UsersService {
    private readonly basePath = "/api/users";

    async getPaginatedUsers(
        params: GetPaginatedUsersRequest,
        token: string
    ): Promise<GetPaginatedUsersResponse> {
        const searchParams = new URLSearchParams();

        if (params.page) {
            searchParams.append("page", params.page.toString());
        }

        if (params.limit) {
            searchParams.append("limit", params.limit.toString());
        }

        const queryString = searchParams.toString();
        const endpoint = queryString ? `${this.basePath}?${queryString}` : this.basePath;

        return httpClient.get<GetPaginatedUsersResponse>(endpoint, {
            Authorization: `Bearer ${token}`,
        });
    }

    async changeUserRole(
        userId: string,
        roleData: ChangeUserRoleRequest,
        token: string
    ): Promise<ChangeUserRoleResponse> {
        return httpClient.patch<ChangeUserRoleResponse>(
            `${this.basePath}/${userId}/role`,
            roleData,
            {
                Authorization: `Bearer ${token}`,
            }
        );
    }
}

export const usersService = new UsersService();
