"use client";

import clsx from "clsx";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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

interface PreviewImage {
    file: File;
    url: string;
    id: string;
}

export const ProductForm = ({ product, categories }: Props) => {
    const router = useRouter();
    const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);

    // Limpiar URLs de objeto cuando el componente se desmonte
    useEffect(() => {
        return () => {
            previewImages.forEach((preview) => {
                URL.revokeObjectURL(preview.url);
            });
        };
    }, [previewImages]);

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

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        // Validar el tamaño total de las imágenes
        const maxSizePerImage = 2 * 1024 * 1024; // 2MB por imagen
        const maxTotalSize = 8 * 1024 * 1024; // 8MB total

        let totalSize = 0;
        const validFiles: File[] = [];

        // Calcular tamaño actual de las vistas previas
        previewImages.forEach((preview) => {
            totalSize += preview.file.size;
        });

        // Validar cada archivo nuevo
        Array.from(files).forEach((file) => {
            if (file.size > maxSizePerImage) {
                alert(`La imagen "${file.name}" es demasiado grande. Máximo 2MB por imagen.`);
                return;
            }

            if (totalSize + file.size > maxTotalSize) {
                alert(`No se puede agregar "${file.name}". El tamaño total excedería 8MB.`);
                return;
            }

            totalSize += file.size;
            validFiles.push(file);
        });

        if (validFiles.length === 0) {
            event.target.value = "";
            return;
        }

        // Crear nuevas vistas previas solo con archivos válidos
        const newPreviews: PreviewImage[] = [];
        validFiles.forEach((file, index) => {
            const url = URL.createObjectURL(file);
            newPreviews.push({
                file,
                url,
                id: `preview-${Date.now()}-${index}`,
            });
        });

        // Agregar las nuevas vistas previas a las existentes
        setPreviewImages((prev) => [...prev, ...newPreviews]);

        // Limpiar el input para permitir seleccionar los mismos archivos nuevamente si es necesario
        event.target.value = "";
    };

    const removePreviewImage = (previewId: string) => {
        setPreviewImages((prev) => {
            const imageToRemove = prev.find((img) => img.id === previewId);
            if (imageToRemove) {
                URL.revokeObjectURL(imageToRemove.url);
            }
            return prev.filter((img) => img.id !== previewId);
        });
    };

    const clearAllPreviews = () => {
        previewImages.forEach((preview) => {
            URL.revokeObjectURL(preview.url);
        });
        setPreviewImages([]);
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

        // Agregar todas las imágenes de vista previa al formData
        previewImages.forEach((preview) => {
            formData.append("images", preview.file);
        });

        const { ok, product: updatedProduct } = await createUpdateProduct(formData);

        if (!ok) {
            alert("Producto no se pudo actualizar");
            return;
        }

        // Limpiar vistas previas después de guardar exitosamente
        previewImages.forEach((preview) => {
            URL.revokeObjectURL(preview.url);
        });
        setPreviewImages([]);

        // Revalidar los datos del servidor y navegar
        router.refresh();
        router.push(`/admin/product/${updatedProduct?.slug}`);
    };

    const onDeleteProductImage = async (image: ProductWithImage) => {
        const { ok, error } = await deleteProductImage(
            image.id,
            image.url,
            product.id,
            product.slug
        );

        if (!ok) {
            alert(error);
            return;
        }

        // Recargar la página para mostrar los cambios
        router.refresh();
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
                        <div className="flex justify-between items-center mb-2">
                            <span>Fotos</span>
                            {previewImages.length > 0 && (
                                <button
                                    type="button"
                                    onClick={clearAllPreviews}
                                    className="text-red-600 text-sm hover:text-red-800"
                                >
                                    Limpiar todas ({previewImages.length})
                                </button>
                            )}
                        </div>
                        <input
                            type="file"
                            multiple
                            className="p-2 border rounded-md bg-gray-200"
                            accept="image/png, image/jpeg, image/avif"
                            onChange={handleImageChange}
                        />
                        <p className="text-xs text-gray-600 mt-1">
                            Puedes seleccionar múltiples imágenes. Máximo 2MB por imagen y 8MB
                            total.
                        </p>
                    </div>

                    {/* Imagenes del producto */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {/* Imágenes existentes del producto */}
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

                        {/* Vista previa de nuevas imágenes */}
                        {previewImages.map((preview) => (
                            <div key={preview.id} className="relative">
                                <img
                                    src={preview.url}
                                    alt="Vista previa"
                                    className="rounded-t-xl shadow-md w-full h-[300px] object-cover"
                                />

                                <button
                                    type="button"
                                    onClick={() => removePreviewImage(preview.id)}
                                    className="btn-danger w-full rounded-b-xl text-xs sm:text-sm py-1 sm:py-2"
                                >
                                    Quitar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </form>
    );
};
