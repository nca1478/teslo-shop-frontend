const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface ApiResponse<T = unknown> {
    data?: T;
    message?: string;
    error?: string;
}

export class HttpClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const config: RequestInit = {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            // Verificar si la respuesta tiene contenido
            const contentType = response.headers.get("content-type");
            const hasJsonContent = contentType && contentType.includes("application/json");

            if (!hasJsonContent || response.status === 204) {
                return {} as T;
            }

            const text = await response.text();
            if (!text) {
                return {} as T;
            }

            return JSON.parse(text);
        } catch (error) {
            console.error("API request failed:", error);
            throw error;
        }
    }

    async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, {
            method: "GET",
            headers,
        });
    }

    async post<T>(endpoint: string, data?: unknown, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, {
            method: "POST",
            body: data ? JSON.stringify(data) : undefined,
            headers,
        });
    }

    async put<T>(endpoint: string, data?: unknown, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, {
            method: "PUT",
            body: data ? JSON.stringify(data) : undefined,
            headers,
        });
    }

    async patch<T>(endpoint: string, data?: unknown, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, {
            method: "PATCH",
            body: data ? JSON.stringify(data) : undefined,
            headers,
        });
    }

    async delete<T>(
        endpoint: string,
        data?: unknown,
        headers?: Record<string, string>
    ): Promise<T> {
        return this.request<T>(endpoint, {
            method: "DELETE",
            body: data ? JSON.stringify(data) : undefined,
            headers,
        });
    }
}

export const httpClient = new HttpClient();
