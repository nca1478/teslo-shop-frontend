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
    const subtitle =
        slug === "new"
            ? "Crear un nuevo producto en el inventario"
            : "Modificar información del producto";

    return (
        <div className="space-y-6">
            <Title
                title={title}
                subtitle={subtitle}
                size="md"
                className="text-center sm:text-left"
            />

            <ProductForm product={product ?? {}} categories={categories} />
        </div>
    );
}
