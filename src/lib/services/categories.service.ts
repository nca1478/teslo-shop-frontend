import { httpClient } from "../http-client";

export interface Category {
    id: string;
    name: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export class CategoriesService {
    private readonly basePath = "/api/categories";

    async getCategories(): Promise<Category[]> {
        try {
            const result = await httpClient.get<Category[]>(this.basePath);
            return result;
        } catch (error) {
            console.error("Error fetching categories:", error);
            return [];
        }
    }
}

export const categoriesService = new CategoriesService();
