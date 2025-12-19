import { httpClient } from "../http-client";
import { Country } from "@/interfaces";

export class CountriesService {
    private readonly basePath = "/api/countries";

    async getCountries(): Promise<Country[]> {
        return httpClient.get<Country[]>(this.basePath);
    }
}

export const countriesService = new CountriesService();
