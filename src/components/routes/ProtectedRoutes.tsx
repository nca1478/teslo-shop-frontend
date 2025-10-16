import { Navigate } from "react-router";
import type { PropsWithChildren } from "react";
import { useAuthStore } from "@/auth/store/auth.store";

export const AuthenticatedRoutes = ({ children }: PropsWithChildren) => {
    const { authStatus } = useAuthStore();

    if (authStatus === "checking") return null;
    if (authStatus === "not-authenticated") return <Navigate to="/auth/login" />;

    return children;
};

export const NotAuthenticatedRoutes = ({ children }: PropsWithChildren) => {
    const { authStatus } = useAuthStore();

    if (authStatus === "checking") return null;
    if (authStatus === "authenticated") return <Navigate to="/" />;

    return children;
};

export const AdminRoutes = ({ children }: PropsWithChildren) => {
    const { authStatus, isAdmin } = useAuthStore();

    if (authStatus === "checking") return null;
    if (authStatus === "not-authenticated") return <Navigate to="/auth/login" />;
    if (!isAdmin()) return <Navigate to="/" />;

    return children;
};
