import { RouterProvider } from "react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { appRouter } from "./app.router";

const queryClient = new QueryClient();

export const TesloShopApp = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <RouterProvider router={appRouter} />;
        </QueryClientProvider>
    );
};
