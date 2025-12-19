"use server";

import { categoriesService } from "@/lib/services";

export const getCategories = async () => {
    try {
        const categories = await categoriesService.getCategories();
        return categories;
    } catch (error) {
        console.log(error);
        return [];
    }
};
