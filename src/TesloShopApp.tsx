import { RouterProvider } from "react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { appRouter } from "./app.router";

const queryClient = new QueryClient();

export const TesloShopApp = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Toaster position="top-right" />
            <RouterProvider router={appRouter} />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};
