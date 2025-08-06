import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface State {
    address: {
        firstName: string;
        lastName: string;
        address: string;
        address2?: string;
        postalCode: string;
        country: string;
        city: string;
        phone: string;
    };

    setAddress: (address: State["address"]) => void;
}

export const useAddressStore = create<State>()(
    devtools(
        persist(
            (set) => ({
                address: {
                    firstName: "",
                    lastName: "",
                    address: "",
                    address2: "",
                    postalCode: "",
                    country: "",
                    city: "",
                    phone: "",
                },

                // Métodos
                setAddress: (address) => {
                    set({ address });
                },
            }),
            {
                name: "address-storage",
                storage: createJSONStorage(() => localStorage),
            }
        )
    )
);
