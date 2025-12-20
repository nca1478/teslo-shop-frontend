"use client";

import clsx from "clsx";
import Link from "next/link";
import { IoInformationOutline } from "react-icons/io5";
import { useRegisterForm } from "../hooks/useRegisterForm";

export const RegisterForm = () => {
    const { register, handleSubmit, errors, errorMessage, isLoading, onSubmit, handleInputChange } =
        useRegisterForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-3 sm:space-y-4">
            {/* Name Field */}
            <div className="flex flex-col">
                <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1.5">
                    Nombre completo
                </label>
                <input
                    id="name"
                    className={clsx(
                        "px-3 py-2.5 sm:px-4 sm:py-3 border bg-gray-200 rounded-lg transition-colors duration-200 text-sm touch-target",
                        {
                            "border-red-500 focus:border-red-500 focus:ring-red-200": errors.name,
                            "border-gray-300 focus:border-blue-500 focus:ring-blue-200":
                                !errors.name,
                        }
                    )}
                    type="text"
                    placeholder="Tu nombre completo"
                    autoFocus
                    {...register("name", {
                        required: "El nombre es requerido",
                        minLength: {
                            value: 2,
                            message: "El nombre debe tener al menos 2 caracteres",
                        },
                        onChange: handleInputChange,
                    })}
                />
            </div>

            {/* Email Field */}
            <div className="flex flex-col">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1.5">
                    Correo electrónico
                </label>
                <input
                    id="email"
                    className={clsx(
                        "px-3 py-2.5 sm:px-4 sm:py-3 border bg-gray-200 rounded-lg transition-colors duration-200 text-sm touch-target",
                        {
                            "border-red-500 focus:border-red-500 focus:ring-red-200": errors.email,
                            "border-gray-300 focus:border-blue-500 focus:ring-blue-200":
                                !errors.email,
                        }
                    )}
                    type="email"
                    placeholder="tu@email.com"
                    {...register("email", {
                        required: "El email es requerido",
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Formato de email inválido",
                        },
                        onChange: handleInputChange,
                    })}
                />
            </div>

            {/* Password Field */}
            <div className="flex flex-col">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1.5">
                    Contraseña
                </label>
                <input
                    id="password"
                    className={clsx(
                        "px-3 py-2.5 sm:px-4 sm:py-3 border bg-gray-200 rounded-lg transition-colors duration-200 text-sm touch-target",
                        {
                            "border-red-500 focus:border-red-500 focus:ring-red-200":
                                errors.password,
                            "border-gray-300 focus:border-blue-500 focus:ring-blue-200":
                                !errors.password,
                        }
                    )}
                    type="password"
                    placeholder="••••••••"
                    {...register("password", {
                        required: "La contraseña es requerida",
                        minLength: {
                            value: 6,
                            message: "Debe tener al menos 6 caracteres",
                        },
                        onChange: handleInputChange,
                    })}
                />
            </div>

            {/* Unified Error Message Area */}
            {errorMessage && (
                <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg p-2.5 w-full">
                    <IoInformationOutline className="h-4 w-4 text-red-500 shrink-0" />
                    <p className="text-xs text-red-600">{errorMessage}</p>
                </div>
            )}

            {/* Register Button */}
            <button
                type="submit"
                className={clsx(
                    "w-full py-2.5 text-sm font-medium rounded-lg transition-all duration-200 touch-target mt-4",
                    {
                        "btn-primary": !isLoading,
                        "btn-disabled": isLoading,
                    }
                )}
                disabled={isLoading}
            >
                {isLoading ? "Creando cuenta..." : "Crear cuenta"}
            </button>

            {/* Divider */}
            <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <div className="px-3 text-gray-600 text-sm">O</div>
                <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Secondary Actions */}
            <div className="flex flex-col space-y-2">
                <Link
                    href="/auth/login"
                    className="btn-secondary text-center py-2.5 text-sm touch-target"
                >
                    Ingresar
                </Link>
            </div>
        </form>
    );
};
