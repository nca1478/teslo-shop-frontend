import { httpClient } from "../http-client";
import { Address } from "@/interfaces";

export interface UserAddress {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    postalCode: string;
    city: string;
    countryId: string;
    phone: string;
}

export interface SetUserAddressRequest {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    postalCode: string;
    phone: string;
    city: string;
    countryId: string;
}

export interface SetUserAddressResponse {
    ok: boolean;
    address?: UserAddress;
    message?: string;
}

export interface DeleteUserAddressResponse {
    ok: boolean;
    message?: string;
}

export class AddressesService {
    private readonly basePath = "/api/addresses";

    async getUserAddress(token: string): Promise<UserAddress | null> {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            return await httpClient.get<UserAddress>(this.basePath, headers);
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async setUserAddress(address: Address, token: string): Promise<SetUserAddressResponse> {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const addressData: SetUserAddressRequest = {
                firstName: address.firstName,
                lastName: address.lastName,
                address: address.address,
                address2: address.address2,
                postalCode: address.postalCode,
                phone: address.phone,
                city: address.city,
                countryId: address.country,
            };

            const result = await httpClient.post<UserAddress>(this.basePath, addressData, headers);

            return {
                ok: true,
                address: result,
            };
        } catch (error) {
            console.log(error);
            return {
                ok: false,
                message: "No se pudo grabar la dirección",
            };
        }
    }

    async deleteUserAddress(token: string): Promise<DeleteUserAddressResponse> {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            await httpClient.delete<void>(this.basePath, headers);

            return { ok: true };
        } catch (error) {
            console.log(error);
            return {
                ok: false,
                message: "No se pudo eliminar la dirección",
            };
        }
    }
}

export const addressesService = new AddressesService();
