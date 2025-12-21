import { httpClient } from "../http-client";
import { UpdateUserProfileRequest } from "../../interfaces";

export interface UserProfileResponse {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
}

export class UserService {
    private readonly baseUrl = "/api/users";

    async getUserProfile(token: string): Promise<UserProfileResponse> {
        return httpClient.get<UserProfileResponse>(`${this.baseUrl}/profile`, {
            Authorization: `Bearer ${token}`,
        });
    }

    async updateUserProfile(
        data: UpdateUserProfileRequest,
        token: string
    ): Promise<UserProfileResponse> {
        return httpClient.patch<UserProfileResponse>(`${this.baseUrl}/profile`, data, {
            Authorization: `Bearer ${token}`,
        });
    }
}

export const userService = new UserService();
