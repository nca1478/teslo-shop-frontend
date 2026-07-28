"use client";

import clsx from "clsx";
import Link from "next/link";
import { IoInformationOutline } from "react-icons/io5";
import { useForgotPasswordForm } from "../hooks/useForgotPasswordForm";

export const ForgotPasswordForm = () => {
    const { register, handleSubmit, errors, errorMessage, isLoading, onSubmit, isSuccess } =
        useForgotPasswordForm();

    if (isSuccess) {
        return (
            <div className="flex flex-col space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-green-700 text-sm font-medium">
                        Código enviado exitosamente
                    </p>
                    <p className="text-green-600 text-xs mt-1">
                        Revisa tu correo electrónico para continuar
                    </p>
                </div>
                <Link
                    href="/auth/login"
                    className="btn-secondary text-center py-2.5 text-sm touch-target"
                >
                    ← Volver al login
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-3 sm:space-y-4">
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
                            "border-gray-300 focus:border-blue-500 focus:ring-blue-200": !errors.email,
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
                    })}
                />
            </div>

            {errorMessage && (
                <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg p-2.5 w-full">
                    <IoInformationOutline className="h-4 w-4 text-red-500 shrink-0" />
                    <p className="text-xs text-red-600">{errorMessage}</p>
                </div>
            )}

            <div className="flex flex-col space-y-2">
                <button
                    type="submit"
                    className={clsx(
                        "w-full py-2.5 text-sm font-medium rounded-lg transition-all duration-200 touch-target cursor-pointer",
                        {
                            "btn-primary": !isLoading,
                            "btn-disabled": isLoading,
                        }
                    )}
                    disabled={isLoading}
                >
                    {isLoading ? "Enviando..." : "Enviar código"}
                </button>

                <Link
                    href="/auth/login"
                    className="btn-secondary text-center py-2.5 text-sm touch-target"
                >
                    ← Volver al login
                </Link>
            </div>
        </form>
    );
};
