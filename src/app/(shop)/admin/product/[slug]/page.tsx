import { redirect } from "next/navigation";
import { getProductBySlug } from "@/actions";
import { Title } from "@/components";
import { ProductForm } from "./ui/ProductForm";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        redirect("/admin/products");
    }

    const title = `${slug === "new" ? "Nuevo" : "Editar"} producto`;

    return (
        <>
            <Title title={title} />

            <ProductForm product={product} />
        </>
    );
}
