import { RouterProvider } from "react-router";
import type { PropsWithChildren } from "react";
import { Toaster } from "sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { CustomFullScreenLoading } from "./components/custom/CustomFullscreenLoading";
import { checkAuthAction } from "./auth/actions/check-auth.action";
import { appRouter } from "./app.router";

const queryClient = new QueryClient();

const CheckAuthProvider = ({ children }: PropsWithChildren) => {
    const { isLoading } = useQuery({
        queryKey: ["auth"],
        queryFn: checkAuthAction,
        retry: false,
        refetchInterval: 1000 * 60 * 1.5,
        refetchOnWindowFocus: true,
    });

    if (isLoading) return <CustomFullScreenLoading />;

    return children;
};

export const TesloShopApp = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Toaster position="top-right" />

            {/* Custom Provider */}
            <CheckAuthProvider>
                <RouterProvider router={appRouter} />
            </CheckAuthProvider>

            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};
