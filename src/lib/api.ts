const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface ApiResponse<T = any> {
    data?: T;
    message?: string;
    error?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: {
        id: string;
        email: string;
        fullName: string;
        roles: string[];
    };
    token: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
}

export interface GetProductsRequest {
    page?: number;
    limit?: number;
    gender?: string;
    category?: string;
    search?: string;
}

export interface Product {
    id: string;
    title: string;
    price: number;
    description: string;
    slug: string;
    stock: number;
    sizes: string[];
    gender: string;
    tags: string[];
    images: string[];
    categoryId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface GetProductsResponse {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const config: RequestInit = {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("API request failed:", error);
            throw error;
        }
    }

    // auth endpoints
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        return this.request<LoginResponse>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials),
        });
    }

    async register(userData: RegisterRequest): Promise<LoginResponse> {
        return this.request<LoginResponse>("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(userData),
        });
    }

    // products endpoints
    async getProducts(params: GetProductsRequest = {}): Promise<GetProductsResponse> {
        const searchParams = new URLSearchParams();

        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.gender) searchParams.append("gender", params.gender);
        if (params.category) searchParams.append("category", params.category);
        if (params.search) searchParams.append("search", params.search);

        const queryString = searchParams.toString();
        const endpoint = `/api/products${queryString ? `?${queryString}` : ""}`;

        return this.request<GetProductsResponse>(endpoint, {
            method: "GET",
        });
    }
}

export const apiClient = new ApiClient();
