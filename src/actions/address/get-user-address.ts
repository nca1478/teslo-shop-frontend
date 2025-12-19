"use server";

import { addressesService } from "@/lib/services";
import { getAuthToken } from "@/lib/session";

export const getUserAddress = async () => {
    try {
        const token = await getAuthToken();

        if (!token) {
            return null;
        }

        const address = await addressesService.getUserAddress(token);

        if (!address) return null;

        const { countryId, address2, ...rest } = address;

        return {
            ...rest,
            country: countryId,
            address2: address2 ? address2 : "",
        };
    } catch (error) {
        console.log(error);
        return null;
    }
};
