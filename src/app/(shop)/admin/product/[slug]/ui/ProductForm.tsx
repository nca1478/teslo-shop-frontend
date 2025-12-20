"use client";

import clsx from "clsx";
import Image from "next/image";
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Información básica del producto */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Información básica
                            </h3>

                            <div className="space-y-4">
                                {/* Título */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Título del producto *
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Ej: Camiseta básica de algodón"
                                        {...register("title", {
                                            required: "El título es requerido",
                                        })}
                                    />
                                </div>

                                {/* Slug */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Slug (URL amigable) *
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="ej: camiseta-basica-algodon"
                                        {...register("slug", { required: "El slug es requerido" })}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Solo letras minúsculas, números y guiones
                                    </p>
                                </div>

                                {/* Descripción */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Descripción *
                                    </label>
                                    <textarea
                                        rows={4}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                        placeholder="Describe las características del producto..."
                                        {...register("description", {
                                            required: "La descripción es requerida",
                                        })}
                                    />
                                </div>

                                {/* Precio y Stock en una fila */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Precio ($) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="0.00"
                                            {...register("price", {
                                                required: "El precio es requerido",
                                                min: {
                                                    value: 0,
                                                    message: "El precio debe ser mayor a 0",
                                                },
                                            })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Stock disponible *
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="0"
                                            {...register("inStock", {
                                                required: "El stock es requerido",
                                                min: {
                                                    value: 0,
                                                    message: "El stock no puede ser negativo",
                                                },
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Categorización */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Categorización
                            </h3>

                            <div className="space-y-4">
                                {/* Género y Categoría en una fila */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Género *
                                        </label>
                                        <select
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            {...register("gender", {
                                                required: "Selecciona un género",
                                            })}
                                        >
                                            <option value="">Seleccionar género</option>
                                            <option value="men">Hombres</option>
                                            <option value="women">Mujeres</option>
                                            <option value="kids">Niños</option>
                                            <option value="unisex">Unisex</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Categoría *
                                        </label>
                                        <select
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            {...register("categoryId", {
                                                required: "Selecciona una categoría",
                                            })}
                                        >
                                            <option value="">Seleccionar categoría</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Etiquetas
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="camiseta, algodón, básica (separadas por comas)"
                                        {...register("tags")}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Separa las etiquetas con comas
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tallas e imágenes */}
                    <div className="space-y-6">
                        {/* Tallas disponibles */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Tallas disponibles
                            </h3>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => onSizeChanged(size)}
                                        className={clsx(
                                            "p-3 border-2 rounded-lg font-medium transition-all text-center hover:scale-105",
                                            {
                                                "bg-blue-500 text-white border-blue-500":
                                                    getValues("sizes").includes(size),
                                                "bg-white text-gray-700 border-gray-300 hover:border-blue-300":
                                                    !getValues("sizes").includes(size),
                                            }
                                        )}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Selecciona las tallas disponibles para este producto
                            </p>
                        </div>

                        {/* Imágenes del producto */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Imágenes del producto
                                </h3>
                                {previewImages.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={clearAllPreviews}
                                        className="text-red-600 text-sm hover:text-red-800 font-medium transition-colors"
                                    >
                                        Limpiar todas ({previewImages.length})
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <input
                                        type="file"
                                        multiple
                                        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        accept="image/png, image/jpeg, image/avif"
                                        onChange={handleImageChange}
                                    />
                                    <div className="mt-2 text-xs text-gray-500 space-y-1">
                                        <p>• Formatos soportados: PNG, JPEG, AVIF</p>
                                        <p>• Máximo 2MB por imagen y 8MB total</p>
                                        <p>• Puedes seleccionar múltiples imágenes a la vez</p>
                                    </div>
                                </div>

                                {/* Grid de imágenes */}
                                {((product.ProductImage?.length ?? 0) > 0 ||
                                    previewImages.length > 0) && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {/* Imágenes existentes del producto */}
                                        {product.ProductImage?.map((image) => (
                                            <div key={image.id} className="relative group">
                                                <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                                                    <ProductImage
                                                        alt={product.title ?? ""}
                                                        src={image.url}
                                                        width={300}
                                                        height={300}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => onDeleteProductImage(image)}
                                                    className="absolute inset-x-0 bottom-0 bg-red-600 text-white text-xs py-2 rounded-b-lg hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        ))}

                                        {/* Vista previa de nuevas imágenes */}
                                        {previewImages.map((preview) => (
                                            <div key={preview.id} className="relative group">
                                                <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                                                    <Image
                                                        src={preview.url}
                                                        alt="Vista previa"
                                                        width={200}
                                                        height={200}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removePreviewImage(preview.id)}
                                                    className="absolute inset-x-0 bottom-0 bg-orange-600 text-white text-xs py-2 rounded-b-lg hover:bg-orange-700 transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    Quitar
                                                </button>
                                                <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                                                    Nuevo
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botón de guardar */}
                <div className="border-t border-gray-200 pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            type="submit"
                            className="w-full sm:w-auto btn-primary px-8 py-3 font-medium"
                        >
                            {product.id ? "Actualizar producto" : "Crear producto"}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
