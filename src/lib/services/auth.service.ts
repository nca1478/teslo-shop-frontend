import { httpClient } from "../http-client";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: {
        id: string;
        email: string;
        name: string;
        roles: string[];
    };
    token: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

export interface SaveSessionRequest {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
        roles: string[];
    };
}

export class AuthService {
    private readonly basePath = "/api/auth";

    async login(credentials: LoginRequest): Promise<LoginResponse> {
        return httpClient.post<LoginResponse>(`${this.basePath}/login`, credentials);
    }

    async register(userData: RegisterRequest): Promise<LoginResponse> {
        return httpClient.post<LoginResponse>(`${this.basePath}/register`, userData);
    }

    async logout(): Promise<void> {
        return httpClient.post<void>(`${this.basePath}/logout`);
    }

    async refreshToken(): Promise<LoginResponse> {
        return httpClient.post<LoginResponse>(`${this.basePath}/refresh`);
    }

    async validateToken(token: string): Promise<boolean> {
        try {
            await httpClient.get<void>(`${this.basePath}/validate`, {
                Authorization: `Bearer ${token}`,
            });
            return true;
        } catch {
            return false;
        }
    }

    async saveSession(sessionData: SaveSessionRequest): Promise<void> {
        const response = await fetch("/api/auth/save-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(sessionData),
        });

        if (!response.ok) {
            throw new Error("Failed to save session");
        }
    }
}

export const authService = new AuthService();
