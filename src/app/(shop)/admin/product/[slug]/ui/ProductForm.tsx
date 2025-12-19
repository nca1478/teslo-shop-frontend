"use client";

import clsx from "clsx";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Category, Product, ProductImage as ProductWithImage } from "@/interfaces";
import { createUpdateProduct, deleteProductImage } from "@/actions";
import { ProductImage } from "@/components";

interface Props {
    // Partial: los datos de Product son opcionales y puede tener ProductImage[] (optional)
    product: Partial<Product> & { ProductImage?: ProductWithImage[] };
    categories: Category[];
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

interface FormInputs {
    title: string;
    slug: string;
    description: string;
    price: number;
    inStock: number;
    sizes: string[];
    tags: string;
    gender: "men" | "women" | "kids" | "unisex";
    categoryId: string;
    images?: FileList;
}

export const ProductForm = ({ product, categories }: Props) => {
    const router = useRouter();
    const {
        handleSubmit,
        register,
        // formState: { isValid },
        getValues,
        setValue,
        watch,
    } = useForm<FormInputs>({
        defaultValues: {
            title: product.title || "",
            slug: product.slug || "",
            description: product.description || "",
            price: product.price || 0,
            inStock: product.inStock || product.stock || 0,
            sizes: product.sizes ?? [],
            tags: product.tags?.join(", ") || "",
            gender: (product.gender as "men" | "women" | "kids" | "unisex") || "men",
            categoryId: product.categoryId || "",
            images: undefined,
        },
    });

    watch("sizes");

    const onSizeChanged = (size: string) => {
        const sizes = new Set(getValues("sizes"));

        if (sizes.has(size)) {
            sizes.delete(size);
        } else {
            sizes.add(size);
        }

        setValue("sizes", Array.from(sizes));
    };

    const onSubmit = async (data: FormInputs) => {
        const formData = new FormData();
        const { images, ...productToSave } = data;

        // agregar si existe (es update) si no (es create)
        if (product.id) {
            formData.append("id", product.id ?? "");
        }

        formData.append("title", productToSave.title);
        formData.append("slug", productToSave.slug);
        formData.append("description", productToSave.description);
        formData.append("price", productToSave.price.toString());
        formData.append("inStock", productToSave.inStock.toString());
        formData.append("sizes", productToSave.sizes.toString());
        formData.append("tags", productToSave.tags);
        formData.append("categoryId", productToSave.categoryId);
        formData.append("gender", productToSave.gender);

        // si vienen images, agregarlas al formData
        if (images) {
            for (let i = 0; i < images.length; i++) {
                formData.append("images", images[i]);
            }
        }

        const { ok, product: updatedProduct } = await createUpdateProduct(formData);

        if (!ok) {
            alert("Producto no se pudo actualizar");
            return;
        }

        // Revalidar los datos del servidor y navegar
        router.refresh();
        router.push(`/admin/product/${updatedProduct?.slug}`);
    };

    const onDeleteProductImage = async (image: ProductWithImage) => {
        const { ok, error } = await deleteProductImage(image.id, image.url);

        if (!ok) {
            alert(error);
            return;
        }

        return;
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3"
        >
            {/* Textos */}
            <div className="w-full">
                {/* Titulo */}
                <div className="flex flex-col mb-2">
                    <span>Título</span>
                    <input
                        type="text"
                        className="p-2 border rounded-md bg-gray-200"
                        {...register("title", { required: true })}
                    />
                </div>

                {/* Slug */}
                <div className="flex flex-col mb-2">
                    <span>Slug</span>
                    <input
                        type="text"
                        className="p-2 border rounded-md bg-gray-200"
                        {...register("slug", { required: true })}
                    />
                </div>

                {/* Descripción */}
                <div className="flex flex-col mb-2">
                    <span>Descripción</span>
                    <textarea
                        rows={5}
                        className="p-2 border rounded-md bg-gray-200"
                        {...register("description", { required: true })}
                    ></textarea>
                </div>

                {/* Precio */}
                <div className="flex flex-col mb-2">
                    <span>Price</span>
                    <input
                        type="number"
                        className="p-2 border rounded-md bg-gray-200"
                        {...register("price", { required: true, min: 0 })}
                    />
                </div>

                {/* Tags */}
                <div className="flex flex-col mb-2">
                    <span>Tags</span>
                    <input
                        type="text"
                        className="p-2 border rounded-md bg-gray-200"
                        {...register("tags", { required: true })}
                    />
                </div>

                {/* Gender */}
                <div className="flex flex-col mb-2">
                    <span>Gender</span>
                    <select
                        className="p-2 border rounded-md bg-gray-200"
                        {...register("gender", { required: true })}
                    >
                        <option value="">[Seleccione]</option>
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="kids">Kids</option>
                        <option value="unisex">Unisex</option>
                    </select>
                </div>

                {/* Categoria */}
                <div className="flex flex-col mb-2">
                    <span>Categoria</span>
                    <select
                        className="p-2 border rounded-md bg-gray-200"
                        {...register("categoryId", { required: true })}
                    >
                        <option value="">[Seleccione]</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button className="btn-primary w-full">Guardar</button>
            </div>

            {/* Selector de tallas y fotos */}
            <div className="w-full">
                {/* Checkboxes */}
                <div className="flex flex-col">
                    {/* Existencia */}
                    <div className="flex flex-col mb-2">
                        <span>Existencia</span>
                        <input
                            type="number"
                            className="p-2 border rounded-md bg-gray-200"
                            {...register("inStock", { required: true, min: 0 })}
                        />
                    </div>

                    {/* Tallas */}
                    <div>
                        <span className="font-bold">Tallas</span>
                        <div className="flex flex-wrap">
                            {sizes.map((size) => (
                                // bg-blue-500 text-white <--- si está seleccionado
                                <div
                                    key={size}
                                    onClick={() => onSizeChanged(size)}
                                    className={clsx(
                                        "p-2 border cursor-pointer rounded-md mr-2 mb-2 w-14 transition-all text-center",
                                        {
                                            "bg-blue-500 text-white":
                                                getValues("sizes").includes(size),
                                        }
                                    )}
                                >
                                    <span>{size}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fotos */}
                    <div className="flex flex-col mb-2">
                        <span>Fotos</span>
                        <input
                            type="file"
                            multiple
                            className="p-2 border rounded-md bg-gray-200"
                            accept="image/png, image/jpeg, image/avif"
                            {...register("images")}
                        />
                    </div>

                    {/* Imagenes del producto */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {product.ProductImage?.map((image) => (
                            <div key={image.id} className="relative">
                                <ProductImage
                                    alt={product.title ?? ""}
                                    src={image.url}
                                    width={300}
                                    height={300}
                                    className="rounded-t-xl shadow-md w-full"
                                />

                                <button
                                    type="button"
                                    onClick={() => onDeleteProductImage(image)}
                                    className="btn-danger w-full rounded-b-xl text-xs sm:text-sm py-1 sm:py-2"
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </form>
    );
};
