import { httpClient } from "../http-client";

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

export interface CreateProductRequest {
    title: string;
    description: string;
    price: number;
    slug: string;
    stock: number;
    sizes: string[];
    gender: string;
    tags: string[];
    images: string[];
    categoryId: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export class ProductsService {
    private readonly basePath = "/api/products";

    async getProducts(params: GetProductsRequest = {}): Promise<GetProductsResponse> {
        const searchParams = new URLSearchParams();

        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.gender) searchParams.append("gender", params.gender);
        if (params.category) searchParams.append("category", params.category);
        if (params.search) searchParams.append("search", params.search);

        const queryString = searchParams.toString();
        const endpoint = `${this.basePath}${queryString ? `?${queryString}` : ""}`;

        return httpClient.get<GetProductsResponse>(endpoint);
    }

    async getProductBySlug(slug: string): Promise<Product> {
        return httpClient.get<Product>(`${this.basePath}/${slug}`);
    }

    async getProductById(id: string): Promise<Product> {
        return httpClient.get<Product>(`${this.basePath}/${id}`);
    }

    async createProduct(productData: CreateProductRequest, token?: string): Promise<Product> {
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        return httpClient.post<Product>(this.basePath, productData, headers);
    }

    async updateProduct(
        id: string,
        productData: UpdateProductRequest,
        token?: string
    ): Promise<Product> {
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        return httpClient.patch<Product>(`${this.basePath}/${id}`, productData, headers);
    }

    async deleteProduct(id: string, token?: string): Promise<void> {
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        return httpClient.delete<void>(`${this.basePath}/${id}`, headers);
    }
}

export const productsService = new ProductsService();
