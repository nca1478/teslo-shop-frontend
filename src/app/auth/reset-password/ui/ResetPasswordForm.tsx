"use client";

import clsx from "clsx";
import Link from "next/link";
import { IoInformationOutline } from "react-icons/io5";
import { useResetPasswordForm } from "../hooks/useResetPasswordForm";

interface Props {
    email: string;
    otp: string;
}

export const ResetPasswordForm = ({ email, otp }: Props) => {
    const { register, handleSubmit, errors, errorMessage, isLoading, onSubmit, isSuccess, watch } =
        useResetPasswordForm(email, otp);

    if (isSuccess) {
        return (
            <div className="flex flex-col space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-green-700 text-sm font-medium">
                        Contraseña restablecida exitosamente
                    </p>
                    <p className="text-green-600 text-xs mt-1">
                        Ahora puedes iniciar sesión con tu nueva contraseña
                    </p>
                </div>
                <Link
                    href="/auth/login"
                    className="btn-primary text-center py-2.5 text-sm touch-target"
                >
                    Iniciar sesión
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-3 sm:space-y-4">
            <div className="flex flex-col">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1.5">
                    Nueva contraseña
                </label>
                <input
                    id="password"
                    className={clsx(
                        "px-3 py-2.5 sm:px-4 sm:py-3 border bg-gray-200 rounded-lg transition-colors duration-200 text-sm touch-target",
                        {
                            "border-red-500 focus:border-red-500 focus:ring-red-200": errors.password,
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
                    })}
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 mb-1.5">
                    Confirmar contraseña
                </label>
                <input
                    id="confirmPassword"
                    className={clsx(
                        "px-3 py-2.5 sm:px-4 sm:py-3 border bg-gray-200 rounded-lg transition-colors duration-200 text-sm touch-target",
                        {
                            "border-red-500 focus:border-red-500 focus:ring-red-200":
                                errors.confirmPassword,
                            "border-gray-300 focus:border-blue-500 focus:ring-blue-200":
                                !errors.confirmPassword,
                        }
                    )}
                    type="password"
                    placeholder="••••••••"
                    {...register("confirmPassword", {
                        required: "Confirma tu contraseña",
                        validate: (value: string) =>
                            value === watch("password") || "Las contraseñas no coinciden",
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
                    {isLoading ? "Restableciendo..." : "Restablecer contraseña"}
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
