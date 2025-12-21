import { Product } from "./product.interface";

export interface SearchProductsRequest {
    q?: string;
    page?: number;
    limit?: number;
}

export interface SearchProductsResponse {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
}
