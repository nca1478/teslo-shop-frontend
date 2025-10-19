import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { AdminRoutes, NotAuthenticatedRoutes } from "./components/routes/ProtectedRoutes";

// Lazy load layouts
const ShopLayout = lazy(() => import("./shop/layouts/ShopLayout"));
const AuthLayout = lazy(() => import("./auth/layouts/AuthLayout"));
const AdminLayout = lazy(() => import("./admin/layouts/AdminLayout"));

import { HomePage } from "./shop/pages/home/HomePage";
import { ProductPage } from "./shop/pages/product/ProductPage";
import { GenderPage } from "./shop/pages/gender/GenderPage";

// Lazy load auth pages (keeping direct imports for now due to export issues)
import { LoginPage } from "./auth/pages/login/LoginPage";
import { RegisterPage } from "./auth/pages/register/RegisterPage";

// Lazy load admin pages (keeping direct imports for now due to export issues)
import { DashboardPage } from "./admin/pages/dashboard/DashboardPage";
import { AdminProductPage } from "./admin/pages/product/AdminProductPage";
import { AdminProductsPage } from "./admin/pages/products/AdminProductsPage";

export const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <ShopLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "product/:idSlug",
                element: <ProductPage />,
            },
            {
                path: "gender/:gender",
                element: <GenderPage />,
            },
        ],
    },
    {
        path: "/auth",
        element: (
            <NotAuthenticatedRoutes>
                <AuthLayout />
            </NotAuthenticatedRoutes>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="/auth/login" />,
            },
            {
                path: "login",
                element: <LoginPage />,
            },
            {
                path: "register",
                element: <RegisterPage />,
            },
        ],
    },
    {
        path: "/admin",
        element: (
            <AdminRoutes>
                <AdminLayout />
            </AdminRoutes>
        ),
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            {
                path: "products",
                element: <AdminProductsPage />,
            },
            {
                path: "products/:id",
                element: <AdminProductPage />,
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/" />,
    },
]);
