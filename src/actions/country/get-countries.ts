"use server";

import { countriesService } from "@/lib/services";

export const getCountries = async () => {
    try {
        const countries = await countriesService.getCountries();
        return countries;
    } catch (error) {
        console.log(error);
        return [];
    }
};
