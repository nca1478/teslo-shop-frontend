import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface State {
    isSideMenuOpen: boolean;
    openSideMenu: () => void;
    closeSideMenu: () => void;
}

export const useUIStore = create<State>()(
    devtools((set) => ({
        isSideMenuOpen: false,
        openSideMenu: () => set({ isSideMenuOpen: true }),
        closeSideMenu: () => set({ isSideMenuOpen: false }),
    }))
);
