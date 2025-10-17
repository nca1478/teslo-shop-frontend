// https://github.com/Klerith/bolt-product-editor
import { Navigate, useParams } from "react-router";
import { Link } from "react-router";
import { useState } from "react";
import { X, Plus, Upload, Tag, SaveAll } from "lucide-react";
import { AdminTitle } from "@/admin/components/AdminTitle";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/admin/hooks/useProduct";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullscreenLoading";
import { ProductForm } from "./ui/ProductForm";

interface Product {
    id: string;
    title: string;
    price: number;
    description: string;
    slug: string;
    stock: number;
    sizes: string[];
    gender: string;
    tags: string[];
    images: string[];
}

export const AdminProductPage = () => {
    const { id } = useParams();
    const { isLoading, isError, data: product } = useProduct(id || "");

    const title = id === "new" ? "Nuevo producto" : "Editar producto";
    const subtitle =
        id === "new" ? "Aquí puedes crear un nuevo producto." : "Aquí puedes editar el producto.";

    if (isError) {
        return <Navigate to="/admin/products" />;
    }

    if (isLoading) {
        return <CustomFullScreenLoading />;
    }

    if (!product) return <Navigate to="/admin/products" />;

    return <ProductForm title={title} subTitle={subtitle} product={product} />;
};
