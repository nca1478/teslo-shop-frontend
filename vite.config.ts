import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Separar React y React DOM
                    "react-vendor": ["react", "react-dom"],
                    // Separar React Router
                    router: ["react-router"],
                    // Separar React Query
                    "react-query": ["@tanstack/react-query", "@tanstack/react-query-devtools"],
                    // Separar React Hook Form
                    forms: ["react-hook-form"],
                    // Separar Radix UI components
                    "radix-ui": [
                        "@radix-ui/react-label",
                        "@radix-ui/react-radio-group",
                        "@radix-ui/react-separator",
                        "@radix-ui/react-slot",
                    ],
                    // Separar utilidades y UI
                    "ui-utils": [
                        "class-variance-authority",
                        "clsx",
                        "tailwind-merge",
                        "lucide-react",
                    ],
                    // Separar Axios y otras utilidades
                    utils: ["axios", "sonner", "zustand"],
                },
            },
        },
    },
});
