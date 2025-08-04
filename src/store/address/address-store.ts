import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
    address: {
        firstName: string;
        lastName: string;
        address: string;
        address2?: string;
        postalCode: string;
        country: string;
        phone: string;
    };

    setAddress: (address: State["address"]) => void;
}

export const useAddressStore = create<State>()(
    persist(
        (set) => ({
            address: {
                firstName: "",
                lastName: "",
                address: "",
                address2: "",
                postalCode: "",
                country: "",
                phone: "",
            },

            // Métodos
            setAddress: (address) => {
                set({ address });
            },
        }),
        {
            name: "address-storage",
        }
    )
);
