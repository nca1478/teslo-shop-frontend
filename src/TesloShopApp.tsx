import type { PropsWithChildren } from "react";
import { Suspense } from "react";
import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CustomFullScreenLoading } from "./components/custom/CustomFullscreenLoading";
import { appRouter } from "./app.router";
import { useCheckAuth } from "./hooks/useCheckAuth";

const queryClient = new QueryClient();

const CheckAuthProvider = ({ children }: PropsWithChildren) => {
    const { isLoading } = useCheckAuth();

    if (isLoading) return <CustomFullScreenLoading />;

    return children;
};

export const TesloShopApp = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Toaster position="top-right" />

            {/* Custom Provider */}
            <CheckAuthProvider>
                <Suspense fallback={<CustomFullScreenLoading />}>
                    <RouterProvider router={appRouter} />
                </Suspense>
            </CheckAuthProvider>

            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};
