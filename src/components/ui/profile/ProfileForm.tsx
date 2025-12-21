"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { getUserProfile, updateUserProfile } from "@/actions";
import { UpdateUserProfileRequest } from "@/interfaces";

interface ProfileFormData {
    name: string;
    email: string;
    password: string;
}

export const ProfileForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
        null
    );
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<ProfileFormData>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    // Load user profile on component mount
    useEffect(() => {
        const loadProfile = async () => {
            try {
                setIsLoadingProfile(true);
                const result = await getUserProfile();

                if (result.ok && result.user) {
                    setValue("name", result.user.name);
                    setValue("email", result.user.email);
                } else {
                    setMessage({
                        type: "error",
                        text: result.message || "Error al cargar el perfil",
                    });
                }
            } catch {
                setMessage({ type: "error", text: "Error al cargar el perfil" });
            } finally {
                setIsLoadingProfile(false);
            }
        };

        loadProfile();
    }, [setValue]);

    const onSubmit = async (data: ProfileFormData) => {
        setIsLoading(true);
        setMessage(null);

        try {
            // Prepare update data (remove empty password and image)
            const updateData: UpdateUserProfileRequest = {
                name: data.name,
                email: data.email,
            };

            if (data.password && data.password.trim() !== "") {
                updateData.password = data.password;
            }

            const result = await updateUserProfile(updateData);

            if (result.ok) {
                setMessage({
                    type: "success",
                    text: result.message || "Perfil actualizado correctamente",
                });
                // Clear password field after successful update
                setValue("password", "");

                // Refresh the page to update session data
                setTimeout(() => {
                    router.refresh();
                }, 1500);
            } else {
                setMessage({
                    type: "error",
                    text: result.message || "Error al actualizar el perfil",
                });
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage({ type: "error", text: "Error al actualizar el perfil" });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingProfile) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Cargando perfil...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Información personal */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Información personal
                            </h3>

                            <div className="space-y-4">
                                {/* Nombre */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre completo *
                                    </label>
                                    <input
                                        type="text"
                                        className={clsx(
                                            "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                                            errors.name ? "border-red-300" : "border-gray-300"
                                        )}
                                        placeholder="Ingresa tu nombre completo"
                                        {...register("name", {
                                            required: "El nombre es requerido",
                                            minLength: {
                                                value: 2,
                                                message:
                                                    "El nombre debe tener al menos 2 caracteres",
                                            },
                                        })}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Correo electrónico *
                                    </label>
                                    <input
                                        type="email"
                                        className={clsx(
                                            "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                                            errors.email ? "border-red-300" : "border-gray-300"
                                        )}
                                        placeholder="tu@email.com"
                                        {...register("email", {
                                            required: "El email es requerido",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Email inválido",
                                            },
                                        })}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Seguridad y personalización */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Seguridad</h3>

                            <div className="space-y-4">
                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nueva contraseña (opcional)
                                    </label>
                                    <input
                                        type="password"
                                        className={clsx(
                                            "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                                            errors.password ? "border-red-300" : "border-gray-300"
                                        )}
                                        placeholder="Deja vacío para mantener la actual"
                                        {...register("password", {
                                            minLength: {
                                                value: 6,
                                                message:
                                                    "La contraseña debe tener al menos 6 caracteres",
                                            },
                                        })}
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.password.message}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">
                                        Mínimo 6 caracteres. Déjalo vacío si no deseas cambiarla.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Message */}
                        {message && (
                            <div
                                className={clsx(
                                    "p-4 rounded-lg border",
                                    message.type === "success"
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : "bg-red-50 text-red-700 border-red-200"
                                )}
                            >
                                <p className="text-sm font-medium">{message.text}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="border-t border-gray-200 pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={clsx(
                                "w-full sm:w-auto btn-primary px-8 py-3 font-medium",
                                isLoading && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Actualizando...
                                </span>
                            ) : (
                                "Actualizar perfil"
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push("/")}
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
