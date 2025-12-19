import { redirect } from "next/navigation";
import { getCategories, getProductBySlug } from "@/actions";
import { Title } from "@/components";
import { ProductForm } from "./ui/ProductForm";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;

    // Si es un producto nuevo, no intentar buscar el producto
    const [product, categories] = await Promise.all([
        slug === "new" ? Promise.resolve(null) : getProductBySlug(slug),
        getCategories(),
    ]);

    if (!product && slug !== "new") {
        redirect("/admin/products");
    }

    const title = `${slug === "new" ? "Nuevo" : "Editar"} producto`;

    return (
        <>
            <Title title={title} />

            <ProductForm product={product ?? {}} categories={categories} />
        </>
    );
}
