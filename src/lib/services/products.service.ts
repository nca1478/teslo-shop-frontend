import { httpClient } from "../http-client";
import { SearchProductsRequest, SearchProductsResponse } from "../../interfaces";

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
    createdAt: Date | string;
    updatedAt: Date | string;
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

export type UpdateProductRequest = Partial<CreateProductRequest>;

export class ProductsService {
    private readonly basePath = "/api/products";

    async getProducts(params: GetProductsRequest = {}): Promise<GetProductsResponse> {
        try {
            const searchParams = new URLSearchParams();

            if (params.page) searchParams.append("page", params.page.toString());
            if (params.limit) searchParams.append("limit", params.limit.toString());
            if (params.gender) searchParams.append("gender", params.gender);
            if (params.category) searchParams.append("category", params.category);
            if (params.search) searchParams.append("search", params.search);

            const queryString = searchParams.toString();
            const endpoint = `${this.basePath}${queryString ? `?${queryString}` : ""}`;

            const result = await httpClient.get<GetProductsResponse>(endpoint);
            return result;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    }

    async getProductBySlug(slug: string): Promise<Product> {
        return httpClient.get<Product>(`${this.basePath}/${slug}`);
    }

    async getProductById(id: string): Promise<Product> {
        return httpClient.get<Product>(`${this.basePath}/${id}`);
    }

    async createProduct(productData: CreateProductRequest, token: string): Promise<Product> {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const result = await httpClient.post<Product>(this.basePath, productData, headers);
            return result;
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    }

    async updateProduct(
        id: string,
        productData: UpdateProductRequest,
        token: string
    ): Promise<Product> {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const result = await httpClient.patch<Product>(
                `${this.basePath}/${id}`,
                productData,
                headers
            );
            return result;
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    }

    async deleteProduct(id: string, token?: string): Promise<void> {
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        return httpClient.delete<void>(`${this.basePath}/${id}`, headers);
    }

    async deleteProductImage(productId: string, imageUrl: string, token: string): Promise<void> {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            await httpClient.delete<void>(
                `${this.basePath}/${productId}/images`,
                { imageUrl },
                headers
            );
        } catch (error) {
            console.error("Error deleting product image:", error);
            throw error;
        }
    }

    async searchProducts(params: SearchProductsRequest = {}): Promise<SearchProductsResponse> {
        try {
            const searchParams = new URLSearchParams();

            if (params.q) searchParams.append("q", params.q);
            if (params.page) searchParams.append("page", params.page.toString());
            if (params.limit) searchParams.append("limit", params.limit.toString());

            const queryString = searchParams.toString();
            const endpoint = `${this.basePath}/search${queryString ? `?${queryString}` : ""}`;

            const result = await httpClient.get<SearchProductsResponse>(endpoint);
            return result;
        } catch (error) {
            console.error("Error searching products:", error);
            throw error;
        }
    }
}

export const productsService = new ProductsService();
