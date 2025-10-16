import type { User } from "@/interfaces/user.interface";
import { create } from "zustand";
import { loginAction } from "../actions/login.action";

type AuthState = {
    // Propiedades
    user: User | null;
    token: string | null;

    // Acciones
    login: (email: string, password: string) => Promise<boolean>;
};

export const useAuthStore = create<AuthState>()((set) => ({
    // Implementación del Store
    user: null,
    token: null,

    // Acciones
    login: async (email: string, password: string) => {
        try {
            const data = await loginAction(email, password);
            localStorage.setItem("token", data.token);

            set({ user: data.user, token: data.token });
            return true;
        } catch (error) {
            localStorage.removeItem("token");
            set({ user: null, token: null });
            return false;
        }
    },
}));
