"use client";

import { useForm } from "react-hook-form";
import clsx from "clsx";
import Image from "next/image";
import { Category, Product, ProductImage } from "@/interfaces";
import { createUpdateProduct } from "@/actions";

interface Props {
    // Partial: los datos de Product son opcionales y puede tener ProductImage[] (optional)
    product: Partial<Product> & { ProductImage?: ProductImage[] };
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
}

export const ProductForm = ({ product, categories }: Props) => {
    const {
        handleSubmit,
        register,
        // formState: { isValid },
        getValues,
        setValue,
        watch,
    } = useForm<FormInputs>({
        defaultValues: {
            ...product,
            tags: product.tags?.join(", "),
            sizes: product.sizes ?? [],
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
        const { ...productToSave } = data;

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

        return await createUpdateProduct(formData);
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
                        <option value="kid">Kid</option>
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
                            accept="image/png, image/jpeg"
                        />
                    </div>

                    {/* Imagenes del producto */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {product.ProductImage?.map((image) => (
                            <div key={image.id}>
                                <Image
                                    alt={product.title ?? ""}
                                    src={`/products/${image.url}`}
                                    width={300}
                                    height={300}
                                    className="rounded-t-xl shadow-md"
                                />

                                <button
                                    type="button"
                                    onClick={() => console.log(image.id, image.url)}
                                    className="btn-danger w-full rounded-b-xl"
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
